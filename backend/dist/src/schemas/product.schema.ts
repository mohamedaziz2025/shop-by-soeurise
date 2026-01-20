import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  ARCHIVED = 'ARCHIVED',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: 'ObjectId', ref: 'Shop', required: true })
  shopId: string;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  sellerId: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.DRAFT })
  status: ProductStatus;

  // Prix
  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  compareAtPrice?: number; // Prix barré

  @Prop({ default: 0, min: 0, max: 100 })
  discountPercent?: number;

  // Images
  @Prop({ required: true })
  mainImage: string;

  @Prop([String])
  images: string[];

  // Catégorisation
  @Prop({ required: true })
  category: string;

  @Prop([String])
  tags: string[];

  // Stock (si pas de variantes)
  @Prop({ default: 0 })
  stock: number;

  @Prop()
  sku?: string;

  // Dimensions & poids pour calcul livraison
  @Prop({
    type: {
      weight: Number, // en grammes
      length: Number, // en cm
      width: Number,
      height: Number,
    },
  })
  dimensions?: {
    weight?: number;
    length?: number;
    width?: number;
    height?: number;
  };

  // Variantes (tailles, couleurs, etc.)
  @Prop({ default: false })
  hasVariants: boolean;

  // SEO
  @Prop()
  metaTitle?: string;

  @Prop()
  metaDescription?: string;

  // Statistiques
  @Prop({ default: 0 })
  viewsCount: number;

  @Prop({ default: 0 })
  salesCount: number;

  @Prop({ default: 0 })
  averageRating: number;

  @Prop({ default: 0 })
  reviewsCount: number;

  // Featured
  @Prop({ default: false })
  isFeatured: boolean;

  // Conformité
  @Prop({ default: true })
  isApproved: boolean;

  @Prop()
  approvalNote?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Indexes
ProductSchema.index({ shopId: 1, status: 1 });
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, status: 1 });
ProductSchema.index({ tags: 1 });
ProductSchema.index({ isFeatured: -1, createdAt: -1 });
ProductSchema.index({ averageRating: -1, reviewsCount: -1 });
ProductSchema.index({ price: 1 });

// Text search
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
