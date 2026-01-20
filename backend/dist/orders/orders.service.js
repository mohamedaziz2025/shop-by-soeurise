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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../schemas/order.schema");
const order_item_schema_1 = require("../schemas/order-item.schema");
const cart_schema_1 = require("../schemas/cart.schema");
const shipment_schema_1 = require("../schemas/shipment.schema");
const product_schema_1 = require("../schemas/product.schema");
let OrdersService = class OrdersService {
    constructor(orderModel, orderItemModel, cartModel, shipmentModel, productModel, configService) {
        this.orderModel = orderModel;
        this.orderItemModel = orderItemModel;
        this.cartModel = cartModel;
        this.shipmentModel = shipmentModel;
        this.productModel = productModel;
        this.configService = configService;
    }
    async createOrder(userId, createOrderDto) {
        const cart = await this.cartModel
            .findOne({ userId })
            .populate('items.productId')
            .populate('items.shopId');
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Votre panier est vide');
        }
        const itemsByShop = this.groupItemsByShop(cart.items);
        const platformCommissionRate = this.configService.get('PLATFORM_COMMISSION_RATE') || 20;
        const parentOrder = new this.orderModel({
            customerId: userId,
            shippingAddress: createOrderDto.shippingAddress,
            billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
            customerNote: createOrderDto.customerNote,
            status: order_schema_1.OrderStatus.PENDING_PAYMENT,
            paymentStatus: order_schema_1.PaymentStatus.PENDING,
            subtotal: 0,
            shippingTotal: 0,
            total: 0,
            isSubOrder: false,
        });
        await parentOrder.save();
        const subOrders = [];
        for (const [shopId, shopItems] of Object.entries(itemsByShop)) {
            const shop = shopItems[0].shopId;
            const subtotal = shopItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
            let shippingCost = 0;
            if (shop.shippingConfig?.enabled) {
                if (shop.shippingConfig.freeShippingThreshold &&
                    subtotal >= shop.shippingConfig.freeShippingThreshold) {
                    shippingCost = 0;
                }
                else if (shop.shippingConfig.flatRate) {
                    shippingCost = shop.shippingConfig.flatRate;
                }
                if (shop.shippingConfig.maxShippingCost &&
                    shippingCost > shop.shippingConfig.maxShippingCost) {
                    shippingCost = shop.shippingConfig.maxShippingCost;
                }
            }
            const total = subtotal + shippingCost;
            const subOrder = new this.orderModel({
                customerId: userId,
                shippingAddress: createOrderDto.shippingAddress,
                billingAddress: createOrderDto.billingAddress || createOrderDto.shippingAddress,
                customerNote: createOrderDto.customerNote,
                status: order_schema_1.OrderStatus.PENDING_PAYMENT,
                paymentStatus: order_schema_1.PaymentStatus.PENDING,
                subtotal,
                shippingTotal: shippingCost,
                total,
                parentOrderId: parentOrder._id,
                isSubOrder: true,
            });
            await subOrder.save();
            for (const item of shopItems) {
                const product = item.productId;
                const orderItem = new this.orderItemModel({
                    orderId: subOrder._id,
                    shopId,
                    sellerId: product.sellerId,
                    productId: product._id,
                    variantId: item.variantId,
                    productSnapshot: {
                        name: product.name,
                        slug: product.slug,
                        image: product.mainImage,
                        sku: product.sku,
                        variantName: item.variantId ? 'Variante' : undefined,
                    },
                    quantity: item.quantity,
                    unitPrice: item.price,
                    platformCommissionRate,
                    shippingCost: shippingCost / shopItems.length,
                });
                await orderItem.save();
            }
            const shipment = new this.shipmentModel({
                orderId: subOrder._id,
                shopId,
                sellerId: shop.sellerId,
                customerId: userId,
                status: 'PENDING',
                shippingAddress: createOrderDto.shippingAddress,
                shippingCost,
            });
            await shipment.save();
            subOrders.push(subOrder);
            parentOrder.subtotal += subtotal;
            parentOrder.shippingTotal += shippingCost;
            parentOrder.total += total;
        }
        await parentOrder.save();
        cart.items = [];
        await cart.save();
        return {
            parentOrder,
            subOrders,
            message: 'Commande créée avec succès',
        };
    }
    groupItemsByShop(items) {
        return items.reduce((acc, item) => {
            const shopId = item.shopId._id.toString();
            if (!acc[shopId]) {
                acc[shopId] = [];
            }
            acc[shopId].push(item);
            return acc;
        }, {});
    }
    async findByCustomerId(customerId) {
        return this.orderModel
            .find({ customerId, isSubOrder: false })
            .sort({ createdAt: -1 });
    }
    async findById(orderId) {
        const order = await this.orderModel.findById(orderId);
        if (!order) {
            throw new common_1.NotFoundException('Commande introuvable');
        }
        let subOrders = [];
        if (!order.isSubOrder) {
            subOrders = await this.orderModel.find({ parentOrderId: order._id });
        }
        const items = await this.orderItemModel
            .find({ orderId: order._id })
            .populate('productId', 'name slug mainImage')
            .populate('shopId', 'name slug');
        const shipments = await this.shipmentModel.find({ orderId: order._id });
        return {
            order,
            subOrders,
            items,
            shipments,
        };
    }
    async findBySellerId(sellerId) {
        const items = await this.orderItemModel
            .find({ sellerId })
            .populate('orderId')
            .populate('productId', 'name slug mainImage')
            .sort({ createdAt: -1 });
        const ordersMap = new Map();
        for (const item of items) {
            const orderId = typeof item.orderId === 'string' ? item.orderId : item.orderId._id.toString();
            if (!ordersMap.has(orderId)) {
                ordersMap.set(orderId, {
                    order: item.orderId,
                    items: [],
                });
            }
            ordersMap.get(orderId).items.push(item);
        }
        return Array.from(ordersMap.values());
    }
    async updateStatus(orderId, status) {
        const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            throw new common_1.NotFoundException('Commande introuvable');
        }
        return order;
    }
    async cancelOrder(orderId, userId, reason) {
        const order = await this.orderModel.findOne({
            _id: orderId,
            customerId: userId,
        });
        if (!order) {
            throw new common_1.NotFoundException('Commande introuvable');
        }
        if (order.status !== order_schema_1.OrderStatus.PENDING_PAYMENT && order.status !== order_schema_1.OrderStatus.PAID) {
            throw new common_1.BadRequestException('Cette commande ne peut plus être annulée');
        }
        order.status = order_schema_1.OrderStatus.CANCELLED;
        order.cancelledAt = new Date();
        order.cancellationReason = reason;
        await order.save();
        return order;
    }
    async findAll(filters) {
        const query = { isSubOrder: false };
        if (filters?.status) {
            query.status = filters.status;
        }
        if (filters?.customerId) {
            query.customerId = filters.customerId;
        }
        return this.orderModel
            .find(query)
            .populate('customerId', 'firstName lastName email')
            .sort({ createdAt: -1 });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(order_item_schema_1.OrderItem.name)),
    __param(2, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(3, (0, mongoose_1.InjectModel)(shipment_schema_1.Shipment.name)),
    __param(4, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map