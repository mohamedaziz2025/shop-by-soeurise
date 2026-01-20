import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderItemDocument = OrderItem & Document;

@Schema({ timestamps: true })
export class OrderItem {
  @Prop({ type: 'ObjectId', ref: 'Order', required: true })
  orderId: string;

  @Prop({ type: 'ObjectId', ref: 'Shop', required: true })
  shopId: string;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  sellerId: string;

  @Prop({ type: 'ObjectId', ref: 'Product', required: true })
  productId: string;

  @Prop({ type: 'ObjectId', ref: 'ProductVariant' })
  variantId?: string;

  // Snapshot du produit au moment de la commande
  @Prop({
    type: {
      name: { type: String, required: true },
      slug: String,
      image: String,
      sku: String,
      variantName: String, // Si variante
    },
    required: true,
  })
  productSnapshot: {
    name: string;
    slug?: string;
    image?: string;
    sku?: string;
    variantName?: string;
  };

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  unitPrice: number;

  @Prop({ required: true })
  totalPrice: number; // quantity * unitPrice

  // Commission plateforme
  @Prop({ required: true, default: 20 })
  platformCommissionRate: number; // En pourcentage

  @Prop({ required: true, default: 0 })
  platformCommissionAmount: number;

  @Prop({ required: true, default: 0 })
  sellerPayout: number; // Ce que touche le vendeur

  // Frais de livraison pour cet item (proratisé)
  @Prop({ default: 0 })
  shippingCost: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

// Indexes
OrderItemSchema.index({ orderId: 1 });
OrderItemSchema.index({ shopId: 1, orderId: 1 });
OrderItemSchema.index({ sellerId: 1, createdAt: -1 });
OrderItemSchema.index({ productId: 1 });

// Calcul automatique des montants
OrderItemSchema.pre('save', function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  this.platformCommissionAmount =
    (this.totalPrice * this.platformCommissionRate) / 100;
  this.sellerPayout = this.totalPrice - this.platformCommissionAmount;
  next();
});
