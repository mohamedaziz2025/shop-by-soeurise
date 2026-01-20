"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const stripe_1 = require("stripe");
const payment_schema_1 = require("../schemas/payment.schema");
const order_schema_1 = require("../schemas/order.schema");
const order_item_schema_1 = require("../schemas/order-item.schema");
const seller_profile_schema_1 = require("../schemas/seller-profile.schema");
let PaymentsService = class PaymentsService {
    constructor(paymentModel, orderModel, orderItemModel, sellerProfileModel, configService) {
        this.paymentModel = paymentModel;
        this.orderModel = orderModel;
        this.orderItemModel = orderItemModel;
        this.sellerProfileModel = sellerProfileModel;
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2023-10-16',
        });
    }
    async createPaymentIntent(userId, orderId) {
        const order = await this.orderModel.findOne({
            _id: orderId,
            customerId: userId,
        });
        if (!order) {
            throw new common_1.NotFoundException('Commande introuvable');
        }
        if (order.paymentStatus !== order_schema_1.PaymentStatus.PENDING) {
            throw new common_1.BadRequestException('Cette commande a déjà été payée');
        }
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(order.total * 100),
            currency: 'eur',
            metadata: {
                orderId: order._id.toString(),
                customerId: userId,
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        const payment = new this.paymentModel({
            orderId: order._id,
            customerId: userId,
            status: payment_schema_1.PaymentStatus.PENDING,
            amount: order.total,
            currency: 'eur',
            paymentMethod: 'CARD',
            stripePaymentIntentId: paymentIntent.id,
        });
        await payment.save();
        order.stripePaymentIntentId = paymentIntent.id;
        order.paymentId = payment._id;
        await order.save();
        return {
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        };
    }
    async confirmPayment(paymentIntentId) {
        const payment = await this.paymentModel.findOne({ stripePaymentIntentId: paymentIntentId });
        if (!payment) {
            throw new common_1.NotFoundException('Paiement introuvable');
        }
        const order = await this.orderModel.findById(payment.orderId);
        if (!order) {
            throw new common_1.NotFoundException('Commande introuvable');
        }
        const subOrders = await this.orderModel.find({ parentOrderId: order._id });
        const splits = [];
        for (const subOrder of subOrders) {
            const items = await this.orderItemModel.find({ orderId: subOrder._id });
            if (items.length === 0)
                continue;
            const shopId = items[0].shopId;
            const sellerId = items[0].sellerId;
            const sellerProfile = await this.sellerProfileModel.findOne({ userId: sellerId });
            if (!sellerProfile || !sellerProfile.stripeConnectId) {
                console.error(`Vendeur ${sellerId} n'a pas de compte Stripe Connect`);
                continue;
            }
            const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
            const shippingCost = subOrder.shippingTotal;
            const totalAmount = subtotal + shippingCost;
            const commissionRate = items[0].platformCommissionRate || 20;
            const commissionAmount = (totalAmount * commissionRate) / 100;
            const sellerPayout = totalAmount - commissionAmount;
            try {
                const transfer = await this.stripe.transfers.create({
                    amount: Math.round(sellerPayout * 100),
                    currency: 'eur',
                    destination: sellerProfile.stripeConnectId,
                    transfer_group: order.orderNumber,
                    metadata: {
                        orderId: subOrder._id.toString(),
                        shopId: shopId.toString(),
                        sellerId: sellerId.toString(),
                    },
                });
                splits.push({
                    shopId,
                    sellerId,
                    amount: totalAmount,
                    platformCommission: commissionAmount,
                    sellerPayout,
                    stripeTransferId: transfer.id,
                    status: 'COMPLETED',
                });
            }
            catch (error) {
                console.error('Erreur lors du transfert Stripe:', error);
                splits.push({
                    shopId,
                    sellerId,
                    amount: totalAmount,
                    platformCommission: commissionAmount,
                    sellerPayout,
                    status: 'FAILED',
                });
            }
        }
        payment.status = payment_schema_1.PaymentStatus.SUCCEEDED;
        payment.splits = splits;
        payment.totalPlatformCommission = splits.reduce((sum, s) => sum + s.platformCommission, 0);
        payment.paidAt = new Date();
        await payment.save();
        order.paymentStatus = order_schema_1.PaymentStatus.PAID;
        order.status = order_schema_1.OrderStatus.PAID;
        order.paidAt = new Date();
        await order.save();
        await this.orderModel.updateMany({ parentOrderId: order._id }, {
            paymentStatus: order_schema_1.PaymentStatus.PAID,
            status: order_schema_1.OrderStatus.PROCESSING,
            paidAt: new Date(),
        });
        return { payment, splits };
    }
    async handleWebhook(signature, payload) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
        }
        catch (err) {
            throw new common_1.BadRequestException(`Webhook Error: ${err.message}`);
        }
        switch (event.type) {
            case 'payment_intent.succeeded':
                await this.confirmPayment(event.data.object.id);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailed(event.data.object.id);
                break;
            case 'charge.refunded':
                await this.handleRefund(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        return { received: true };
    }
    async handlePaymentFailed(paymentIntentId) {
        const payment = await this.paymentModel.findOne({
            stripePaymentIntentId: paymentIntentId,
        });
        if (payment) {
            payment.status = payment_schema_1.PaymentStatus.FAILED;
            payment.failedAt = new Date();
            await payment.save();
            await this.orderModel.findByIdAndUpdate(payment.orderId, {
                paymentStatus: order_schema_1.PaymentStatus.FAILED,
                status: order_schema_1.OrderStatus.CANCELLED,
            });
        }
    }
    async handleRefund(charge) {
        const payment = await this.paymentModel.findOne({
            stripeChargeId: charge.id,
        });
        if (payment) {
            const refundAmount = charge.amount_refunded / 100;
            payment.status = charge.refunded
                ? payment_schema_1.PaymentStatus.REFUNDED
                : payment_schema_1.PaymentStatus.PARTIALLY_REFUNDED;
            payment.refundedAmount = refundAmount;
            await payment.save();
            await this.orderModel.findByIdAndUpdate(payment.orderId, {
                status: order_schema_1.OrderStatus.REFUNDED,
            });
        }
    }
    async createConnectAccount(sellerId) {
        const sellerProfile = await this.sellerProfileModel.findOne({ userId: sellerId });
        if (!sellerProfile) {
            throw new common_1.NotFoundException('Profil vendeur introuvable');
        }
        if (sellerProfile.stripeConnectId) {
            throw new common_1.BadRequestException('Ce vendeur a déjà un compte Stripe Connect');
        }
        const account = await this.stripe.accounts.create({
            type: 'express',
            country: 'FR',
            email: sellerProfile.businessEmail,
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
            business_type: 'individual',
            metadata: {
                sellerId: sellerId.toString(),
                shopName: sellerProfile.businessName,
            },
        });
        sellerProfile.stripeConnectId = account.id;
        await sellerProfile.save();
        const accountLink = await this.stripe.accountLinks.create({
            account: account.id,
            refresh_url: `${this.configService.get('FRONTEND_URL')}/seller/stripe/refresh`,
            return_url: `${this.configService.get('FRONTEND_URL')}/seller/stripe/success`,
            type: 'account_onboarding',
        });
        return {
            accountId: account.id,
            onboardingUrl: accountLink.url,
        };
    }
    async getConnectDashboard(sellerId) {
        const sellerProfile = await this.sellerProfileModel.findOne({ userId: sellerId });
        if (!sellerProfile || !sellerProfile.stripeConnectId) {
            throw new common_1.NotFoundException('Compte Stripe Connect introuvable');
        }
        const loginLink = await this.stripe.accounts.createLoginLink(sellerProfile.stripeConnectId);
        return { dashboardUrl: loginLink.url };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(2, (0, mongoose_1.InjectModel)(order_item_schema_1.OrderItem.name)),
    __param(3, (0, mongoose_1.InjectModel)(seller_profile_schema_1.SellerProfile.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map