import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PayoutDocument = Payout & Document;

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Payout {
  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  sellerId: string;

  @Prop({ type: 'ObjectId', ref: 'Shop', required: true })
  shopId: string;

  @Prop({ type: String, enum: PayoutStatus, default: PayoutStatus.PENDING })
  status: PayoutStatus;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'EUR' })
  currency: string;

  // Stripe Connect
  @Prop({ required: true })
  stripeConnectAccountId: string;

  @Prop()
  stripeTransferId?: string;

  @Prop()
  stripePayoutId?: string;

  // Période concernée
  @Prop({ required: true })
  periodStart: Date;

  @Prop({ required: true })
  periodEnd: Date;

  // Détails du paiement
  @Prop({
    type: {
      totalSales: { type: Number, default: 0 },
      totalOrders: { type: Number, default: 0 },
      platformCommission: { type: Number, default: 0 },
      shippingReimbursement: { type: Number, default: 0 },
      adjustments: { type: Number, default: 0 },
    },
    required: true,
  })
  breakdown: {
    totalSales: number;
    totalOrders: number;
    platformCommission: number;
    shippingReimbursement: number;
    adjustments: number;
  };

  // Références aux commandes concernées
  @Prop([{ type: 'ObjectId', ref: 'Order' }])
  orderIds: string[];

  // Dates importantes
  @Prop()
  paidAt?: Date;

  @Prop()
  failedAt?: Date;

  @Prop()
  failureReason?: string;

  // Méthode de paiement
  @Prop({ default: 'STRIPE_CONNECT' })
  paymentMethod: string;

  // Notes
  @Prop()
  adminNote?: string;

  @Prop()
  sellerNote?: string;
}

export const PayoutSchema = SchemaFactory.createForClass(Payout);

// Indexes
PayoutSchema.index({ sellerId: 1, createdAt: -1 });
PayoutSchema.index({ shopId: 1, status: 1 });
PayoutSchema.index({ status: 1, createdAt: -1 });
PayoutSchema.index({ stripeConnectAccountId: 1 });
PayoutSchema.index({ periodStart: 1, periodEnd: 1 });
PayoutSchema.index({ createdAt: -1 });
