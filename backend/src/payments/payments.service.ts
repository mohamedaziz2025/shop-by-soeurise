import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import Stripe from 'stripe';
import { Payment, PaymentDocument, PaymentStatus as PaymentSchemaStatus } from '../schemas/payment.schema';
import { Order, OrderDocument, OrderStatus, PaymentStatus } from '../schemas/order.schema';
import { OrderItem, OrderItemDocument } from '../schemas/order-item.schema';
import { SellerProfile, SellerProfileDocument } from '../schemas/seller-profile.schema';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItemDocument>,
    @InjectModel(SellerProfile.name) private sellerProfileModel: Model<SellerProfileDocument>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Créer un Payment Intent Stripe pour une commande
   */
  async createPaymentIntent(userId: string, orderId: string) {
    const order = await this.orderModel.findOne({
      _id: orderId,
      customerId: userId,
    });

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    if (order.paymentStatus !== PaymentStatus.PENDING) {
      throw new BadRequestException('Cette commande a déjà été payée');
    }

    // Créer le Payment Intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // En centimes
      currency: 'eur',
      metadata: {
        orderId: order._id.toString(),
        customerId: userId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Créer l'enregistrement Payment
    const payment = new this.paymentModel({
      orderId: order._id,
      customerId: userId,
      status: PaymentSchemaStatus.PENDING,
      amount: order.total,
      currency: 'eur',
      paymentMethod: 'CARD',
      stripePaymentIntentId: paymentIntent.id,
    });

    await payment.save();

    // Mettre à jour la commande
    order.stripePaymentIntentId = paymentIntent.id;
    order.paymentId = payment._id as any;
    await order.save();

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  /**
   * Confirmer un paiement et effectuer le split vers les vendeurs
   */
  async confirmPayment(paymentIntentId: string) {
    const payment = await this.paymentModel.findOne({ stripePaymentIntentId: paymentIntentId });

    if (!payment) {
      throw new NotFoundException('Paiement introuvable');
    }

    const order = await this.orderModel.findById(payment.orderId);

    if (!order) {
      throw new NotFoundException('Commande introuvable');
    }

    // Récupérer les sous-commandes
    const subOrders = await this.orderModel.find({ parentOrderId: order._id });

    // Pour chaque sous-commande, effectuer le split du paiement
    const splits = [];

    for (const subOrder of subOrders) {
      // Récupérer les items de la sous-commande
      const items = await this.orderItemModel.find({ orderId: subOrder._id });

      if (items.length === 0) continue;

      const shopId = items[0].shopId;
      const sellerId = items[0].sellerId;

      // Récupérer le profil vendeur avec Stripe Connect ID
      const sellerProfile = await this.sellerProfileModel.findOne({ userId: sellerId });

      if (!sellerProfile || !sellerProfile.stripeConnectId) {
        console.error(`Vendeur ${sellerId} n'a pas de compte Stripe Connect`);
        continue;
      }

      // Calculer les montants
      const subtotal = items.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      const shippingCost = subOrder.shippingTotal;
      const totalAmount = subtotal + shippingCost;

      // Calculer la commission plateforme (moyenne des items)
      const commissionRate = items[0].platformCommissionRate || 20;
      const commissionAmount = (totalAmount * commissionRate) / 100;
      const sellerPayout = totalAmount - commissionAmount;

      // Créer le transfert Stripe vers le vendeur
      try {
        const transfer = await this.stripe.transfers.create({
          amount: Math.round(sellerPayout * 100), // En centimes
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
      } catch (error) {
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

    // Mettre à jour le payment
    payment.status = PaymentSchemaStatus.SUCCEEDED;
    payment.splits = splits;
    payment.totalPlatformCommission = splits.reduce(
      (sum, s) => sum + s.platformCommission,
      0,
    );
    payment.paidAt = new Date();

    await payment.save();

    // Mettre à jour la commande parente
    order.paymentStatus = PaymentStatus.PAID;
    order.status = OrderStatus.PAID;
    order.paidAt = new Date();
    await order.save();

    // Mettre à jour les sous-commandes
    await this.orderModel.updateMany(
      { parentOrderId: order._id },
      {
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.PROCESSING,
        paidAt: new Date(),
      },
    );

    return { payment, splits };
  }

  /**
   * Webhook Stripe pour gérer les événements
   */
  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    // Gérer les différents événements
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

  /**
   * Gérer un paiement échoué
   */
  private async handlePaymentFailed(paymentIntentId: string) {
    const payment = await this.paymentModel.findOne({
      stripePaymentIntentId: paymentIntentId,
    });

    if (payment) {
      payment.status = PaymentSchemaStatus.FAILED;
      payment.failedAt = new Date();
      await payment.save();

      // Mettre à jour la commande
      await this.orderModel.findByIdAndUpdate(payment.orderId, {
        paymentStatus: PaymentStatus.FAILED,
        status: OrderStatus.CANCELLED,
      });
    }
  }

  /**
   * Gérer un remboursement
   */
  private async handleRefund(charge: Stripe.Charge) {
    const payment = await this.paymentModel.findOne({
      stripeChargeId: charge.id,
    });

    if (payment) {
      const refundAmount = charge.amount_refunded / 100;

      payment.status = charge.refunded
        ? PaymentSchemaStatus.REFUNDED
        : PaymentSchemaStatus.PARTIALLY_REFUNDED;
      payment.refundedAmount = refundAmount;

      await payment.save();

      // Mettre à jour la commande
      await this.orderModel.findByIdAndUpdate(payment.orderId, {
        status: OrderStatus.REFUNDED,
      });
    }
  }

  /**
   * Créer un compte Stripe Connect pour un vendeur
   */
  async createConnectAccount(sellerId: string) {
    const sellerProfile = await this.sellerProfileModel.findOne({ userId: sellerId });

    if (!sellerProfile) {
      throw new NotFoundException('Profil vendeur introuvable');
    }

    if (sellerProfile.stripeConnectId) {
      throw new BadRequestException('Ce vendeur a déjà un compte Stripe Connect');
    }

    // Créer le compte Connect
    const account = await this.stripe.accounts.create({
      type: 'express',
      country: 'FR',
      email: sellerProfile.businessEmail,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual', // ou 'company' selon le cas
      metadata: {
        sellerId: sellerId.toString(),
        shopName: sellerProfile.businessName,
      },
    });

    // Sauvegarder le Stripe Connect ID
    sellerProfile.stripeConnectId = account.id;
    await sellerProfile.save();

    // Créer le lien d'onboarding
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

  /**
   * Récupérer le dashboard Stripe Connect d'un vendeur
   */
  async getConnectDashboard(sellerId: string) {
    const sellerProfile = await this.sellerProfileModel.findOne({ userId: sellerId });

    if (!sellerProfile || !sellerProfile.stripeConnectId) {
      throw new NotFoundException('Compte Stripe Connect introuvable');
    }

    const loginLink = await this.stripe.accounts.createLoginLink(
      sellerProfile.stripeConnectId,
    );

    return { dashboardUrl: loginLink.url };
  }
}
