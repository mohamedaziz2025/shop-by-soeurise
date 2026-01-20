import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShipmentDocument = Shipment & Document;

export enum ShipmentStatus {
  PENDING = 'PENDING',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
}

export enum ShippingCarrier {
  COLISSIMO = 'COLISSIMO',
  CHRONOPOST = 'CHRONOPOST',
  DHL = 'DHL',
  UPS = 'UPS',
  MONDIAL_RELAY = 'MONDIAL_RELAY',
  OTHER = 'OTHER',
}

@Schema({ timestamps: true })
export class Shipment {
  @Prop({ type: 'ObjectId', ref: 'Order', required: true })
  orderId: string;

  @Prop({ type: 'ObjectId', ref: 'Shop', required: true })
  shopId: string;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  sellerId: string;

  @Prop({ type: 'ObjectId', ref: 'User', required: true })
  customerId: string;

  @Prop({ type: String, enum: ShipmentStatus, default: ShipmentStatus.PENDING })
  status: ShipmentStatus;

  // Adresse de livraison (copie de l'ordre)
  @Prop({
    type: {
      firstName: String,
      lastName: String,
      street: String,
      city: String,
      postalCode: String,
      country: String,
      phone: String,
      additionalInfo: String,
    },
    required: true,
  })
  shippingAddress: {
    firstName: string;
    lastName: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
    additionalInfo?: string;
  };

  // Transporteur
  @Prop({ type: String, enum: ShippingCarrier })
  carrier?: ShippingCarrier;

  @Prop()
  carrierOther?: string; // Si carrier = OTHER

  @Prop()
  trackingNumber?: string;

  @Prop()
  trackingUrl?: string;

  // Coût
  @Prop({ required: true, default: 0 })
  shippingCost: number;

  // Délai estimé
  @Prop()
  estimatedDeliveryDate?: Date;

  // Dates importantes
  @Prop()
  shippedAt?: Date;

  @Prop()
  deliveredAt?: Date;

  // Notes
  @Prop()
  sellerNote?: string;

  @Prop()
  deliveryNote?: string; // Note de livraison

  // Preuve de livraison
  @Prop()
  proofOfDelivery?: string; // URL de l'image/document

  // Historique des statuts
  @Prop({
    type: [
      {
        status: String,
        note: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  statusHistory: Array<{
    status: string;
    note?: string;
    timestamp: Date;
  }>;
}

export const ShipmentSchema = SchemaFactory.createForClass(Shipment);

// Indexes
ShipmentSchema.index({ orderId: 1 });
ShipmentSchema.index({ shopId: 1, status: 1 });
ShipmentSchema.index({ sellerId: 1, createdAt: -1 });
ShipmentSchema.index({ customerId: 1, status: 1 });
ShipmentSchema.index({ trackingNumber: 1 });
ShipmentSchema.index({ status: 1, createdAt: -1 });

// Middleware pour historique des statuts
ShipmentSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});
