import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductVariantDocument = ProductVariant & Document;

@Schema({ timestamps: true })
export class ProductVariant {
  @Prop({ type: 'ObjectId', ref: 'Product', required: true })
  productId: string;

  @Prop({ required: true })
  name: string; // Ex: "Rouge - Taille M"

  // Options (ex: couleur, taille)
  @Prop({
    type: [
      {
        name: String, // "Couleur", "Taille"
        value: String, // "Rouge", "M"
      },
    ],
    required: true,
  })
  options: Array<{
    name: string;
    value: string;
  }>;

  // Prix spécifique (si différent du produit principal)
  @Prop()
  price?: number;

  @Prop()
  compareAtPrice?: number;

  // Stock
  @Prop({ required: true, default: 0 })
  stock: number;

  @Prop({ required: true, unique: true })
  sku: string;

  // Image spécifique
  @Prop()
  image?: string;

  // Poids spécifique
  @Prop()
  weight?: number;

  // Actif ou non
  @Prop({ default: true })
  isActive: boolean;

  // Statistiques
  @Prop({ default: 0 })
  salesCount: number;
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);

// Indexes
ProductVariantSchema.index({ productId: 1, isActive: 1 });
ProductVariantSchema.index({ sku: 1 });
ProductVariantSchema.index({ stock: 1 });
