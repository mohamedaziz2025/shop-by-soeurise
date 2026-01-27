import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopDocument = Shop & Document;

export enum ShopStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

@Schema({ timestamps: true })
export class Shop {
  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  sellerId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  logo?: string;

  @Prop()
  banner?: string;

  @Prop({ type: String, enum: ShopStatus, default: ShopStatus.ACTIVE })
  status: ShopStatus;

  // Catégories de produits
  @Prop([String])
  categories: string[];

  // Prix de livraison par boutique (obligatoire)
  @Prop({ required: true, type: Number, min: 0 })
  shippingPrice: number;

  // Configuration livraison avancée
  @Prop({
    type: {
      enabled: { type: Boolean, default: true },
      flatRate: { type: Number }, // Tarif fixe
      freeShippingThreshold: { type: Number }, // Livraison gratuite à partir de X€
      maxShippingCost: { type: Number }, // Plafond imposé par plateforme
      estimatedDays: { type: Number, default: 3 }, // Délai estimé
      shippingZones: [String], // France, Europe, etc.
    },
    default: {},
  })
  shippingConfig: {
    enabled: boolean;
    flatRate?: number;
    freeShippingThreshold?: number;
    maxShippingCost?: number;
    estimatedDays: number;
    shippingZones: string[];
  };

  // Politiques
  @Prop()
  returnPolicy?: string;

  @Prop()
  privacyPolicy?: string;

  // Réseaux sociaux
  @Prop({
    type: {
      instagram: String,
      facebook: String,
      website: String,
    },
  })
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };

  // Statistiques
  @Prop({ default: 0 })
  totalProducts: number;

  @Prop({ default: 0 })
  totalSales: number;

  @Prop({ default: 0 })
  totalOrders: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  // Featured (mise en avant par admin)
  @Prop({ default: false })
  isFeatured: boolean;

  // Conformité plateforme
  @Prop({ default: true })
  isCompliant: boolean;

  @Prop()
  nonComplianceReason?: string;
}

export const ShopSchema = SchemaFactory.createForClass(Shop);

// Indexes
ShopSchema.index({ sellerId: 1 });
ShopSchema.index({ slug: 1 });
ShopSchema.index({ status: 1 });
ShopSchema.index({ isFeatured: -1, averageRating: -1 });
ShopSchema.index({ categories: 1 });
ShopSchema.index({ createdAt: -1 });
