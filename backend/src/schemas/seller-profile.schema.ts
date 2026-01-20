import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SellerProfileDocument = SellerProfile & Document;

export enum SellerStatus {
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

@Schema({ timestamps: true })
export class SellerProfile {
  @Prop({ type: 'ObjectId', ref: 'User', required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  businessName: string;

  @Prop({ required: true })
  businessDescription: string;

  @Prop({ type: String, enum: SellerStatus, default: SellerStatus.PENDING_APPROVAL })
  status: SellerStatus;

  // Informations légales
  @Prop({ required: true })
  siret: string;

  @Prop({ required: true })
  tvaNumber: string;

  @Prop({ required: true })
  legalForm: string; // SARL, SAS, Auto-entrepreneur, etc.

  // Adresse professionnelle
  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'France' },
    },
    required: true,
  })
  businessAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };

  // Contact professionnel
  @Prop({ required: true })
  businessEmail: string;

  @Prop({ required: true })
  businessPhone: string;

  // Stripe Connect
  @Prop()
  stripeConnectId?: string;

  @Prop({ default: false })
  stripeOnboardingComplete: boolean;

  // Documents de validation
  @Prop([String])
  documents?: string[]; // URLs des documents uploadés

  // Commission (par défaut, peut être personnalisée par admin)
  @Prop({ default: 20, min: 0, max: 50 })
  commissionRate: number; // En pourcentage

  // Validation admin
  @Prop()
  approvedBy?: string; // UserId de l'admin

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectionReason?: string;

  // Statistiques
  @Prop({ default: 0 })
  totalSales: number;

  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;
}

export const SellerProfileSchema = SchemaFactory.createForClass(SellerProfile);

// Indexes
SellerProfileSchema.index({ userId: 1 });
SellerProfileSchema.index({ status: 1 });
SellerProfileSchema.index({ stripeConnectId: 1 });
SellerProfileSchema.index({ createdAt: -1 });
