import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string; // Ex: ORD-2026-001234

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  customerId: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING_PAYMENT })
  status: OrderStatus;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  // Adresse de livraison
  @Prop({
    type: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      additionalInfo: String,
    },
    required: true,
  })
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    additionalInfo?: string;
  };

  // Adresse de facturation (si différente)
  @Prop({
    type: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      postalCode: String,
      country: String,
    },
  })
  billingAddress?: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  // Montants
  @Prop({ required: true, default: 0 })
  subtotal: number; // Total produits

  @Prop({ required: true, default: 0 })
  shippingTotal: number; // Total livraison

  @Prop({ default: 0 })
  discountTotal: number; // Réductions

  @Prop({ required: true, default: 0 })
  total: number; // Total final

  // Paiement Stripe
  @Prop()
  stripePaymentIntentId?: string;

  @Prop()
  stripeChargeId?: string;

  @Prop({ type: 'ObjectId', ref: 'Payment' })
  paymentId?: string;

  // Notes
  @Prop()
  customerNote?: string;

  @Prop()
  adminNote?: string;

  // Traçabilité
  @Prop()
  paidAt?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  cancellationReason?: string;

  // Parent order (pour commande globale multi-boutiques)
  @Prop({ type: 'ObjectId', ref: 'Order' })
  parentOrderId?: string;

  @Prop({ default: false })
  isSubOrder: boolean; // Si c'est une sous-commande par boutique
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Indexes
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ customerId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ parentOrderId: 1 });
OrderSchema.index({ stripePaymentIntentId: 1 });
OrderSchema.index({ createdAt: -1 });

// Génération automatique du numéro de commande
OrderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `ORD-${year}-${random}`;
  }
  next();
});
