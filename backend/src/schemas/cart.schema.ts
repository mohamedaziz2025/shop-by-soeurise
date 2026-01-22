import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: 'ObjectId', ref: 'User' })
  userId?: string;

  // Support guest carts via a generated guest identifier stored in localStorage
  @Prop()
  guestId?: string;

  @Prop({
    type: [
      {
        productId: { type: 'ObjectId', ref: 'Product', required: true },
        variantId: { type: 'ObjectId', ref: 'ProductVariant' },
        shopId: { type: 'ObjectId', ref: 'Shop', required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        // Snapshot des infos produit au moment de l'ajout
        productSnapshot: {
          name: String,
          image: String,
          slug: String,
        },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  items: Array<{
    productId: string;
    variantId?: string;
    shopId: string;
    quantity: number;
    price: number;
    productSnapshot: {
      name: string;
      image: string;
      slug: string;
    };
    addedAt: Date;
  }>;

  // Totaux calculés
  @Prop({ default: 0 })
  subtotal: number;

  @Prop({ default: 0 })
  totalItems: number;

  // Dernière mise à jour
  @Prop({ default: Date.now })
  lastActivityAt: Date;
  static items: any;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Indexes
CartSchema.index({ userId: 1 });
CartSchema.index({ guestId: 1 });
CartSchema.index({ 'items.productId': 1 });
CartSchema.index({ 'items.shopId': 1 });
CartSchema.index({ lastActivityAt: 1 }); // Pour nettoyer les vieux paniers

// Middleware pour mettre à jour lastActivityAt
CartSchema.pre('save', function (next) {
  this.lastActivityAt = new Date();
  next();
});
