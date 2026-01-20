import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentMethod {
  CARD = 'CARD',
  SEPA = 'SEPA',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCEEDED = 'SUCCEEDED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: 'ObjectId', ref: 'Order', required: true })
  orderId: string;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  customerId: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'EUR' })
  currency: string;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  // Stripe
  @Prop({ required: true, unique: true })
  stripePaymentIntentId: string;

  @Prop()
  stripeChargeId?: string;

  @Prop()
  stripePaymentMethodId?: string;

  // Split des paiements vers les vendeurs
  @Prop({
    type: [
      {
        shopId: { type: 'ObjectId', ref: 'Shop' },
        sellerId: { type: 'ObjectId', ref: 'User' },
        amount: Number,
        platformCommission: Number,
        sellerPayout: Number,
        stripeTransferId: String,
        status: { type: String, default: 'PENDING' },
      },
    ],
    default: [],
  })
  splits: Array<{
    shopId: string;
    sellerId: string;
    amount: number;
    platformCommission: number;
    sellerPayout: number;
    stripeTransferId?: string;
    status: string;
  }>;

  // Commission totale plateforme
  @Prop({ default: 0 })
  totalPlatformCommission: number;

  // Remboursements
  @Prop({ default: 0 })
  refundedAmount: number;

  @Prop([
    {
      amount: Number,
      reason: String,
      stripeRefundId: String,
      refundedAt: Date,
    },
  ])
  refunds?: Array<{
    amount: number;
    reason?: string;
    stripeRefundId?: string;
    refundedAt: Date;
  }>;

  // Métadonnées
  @Prop()
  customerEmail?: string;

  @Prop()
  customerName?: string;

  // Dates importantes
  @Prop()
  paidAt?: Date;

  @Prop()
  failedAt?: Date;

  @Prop()
  failureReason?: string;

  // Webhook events
  @Prop([String])
  webhookEvents?: string[];
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

// Indexes
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ customerId: 1, createdAt: -1 });
PaymentSchema.index({ stripePaymentIntentId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ 'splits.shopId': 1 });
PaymentSchema.index({ 'splits.sellerId': 1 });
PaymentSchema.index({ createdAt: -1 });
