import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ReviewDocument = Review & Document;

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: 'ObjectId', ref: 'Product', required: true })
  productId: string;

  @Prop({ type: 'ObjectId', ref: 'Shop', required: true })
  shopId: string;

  @Prop({ type: 'ObjectId', ref: 'Order', required: true })
  orderId: string;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  customerId: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop()
  title?: string;

  @Prop({ required: true })
  comment: string;

  @Prop([String])
  images?: string[];

  @Prop({ type: String, enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus;

  // Vérifié (client a bien acheté le produit)
  @Prop({ default: true })
  isVerifiedPurchase: boolean;

  // Utile / pas utile
  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop({ default: 0 })
  notHelpfulCount: number;

  // Réponse du vendeur
  @Prop({
    type: {
      sellerId: { type: 'ObjectId', ref: 'User' },
      comment: String,
      respondedAt: Date,
    },
  })
  sellerResponse?: {
    sellerId: string;
    comment: string;
    respondedAt: Date;
  };

  // Modération
  @Prop()
  moderatedBy?: string; // Admin userId

  @Prop()
  moderatedAt?: Date;

  @Prop()
  moderationReason?: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Indexes
ReviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
ReviewSchema.index({ shopId: 1, status: 1 });
ReviewSchema.index({ customerId: 1, createdAt: -1 });
ReviewSchema.index({ orderId: 1 });
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ rating: -1, helpfulCount: -1 });

// Un client ne peut laisser qu'un seul avis par produit et commande
ReviewSchema.index({ customerId: 1, productId: 1, orderId: 1 }, { unique: true });
