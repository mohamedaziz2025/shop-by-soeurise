import { Document } from 'mongoose';
export type ShipmentDocument = Shipment & Document;
export declare enum ShipmentStatus {
    PENDING = "PENDING",
    PREPARING = "PREPARING",
    SHIPPED = "SHIPPED",
    IN_TRANSIT = "IN_TRANSIT",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED",
    RETURNED = "RETURNED"
}
export declare enum ShippingCarrier {
    COLISSIMO = "COLISSIMO",
    CHRONOPOST = "CHRONOPOST",
    DHL = "DHL",
    UPS = "UPS",
    MONDIAL_RELAY = "MONDIAL_RELAY",
    OTHER = "OTHER"
}
export declare class Shipment {
    orderId: string;
    shopId: string;
    sellerId: string;
    customerId: string;
    status: ShipmentStatus;
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
    carrier?: ShippingCarrier;
    carrierOther?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippingCost: number;
    estimatedDeliveryDate?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    sellerNote?: string;
    deliveryNote?: string;
    proofOfDelivery?: string;
    statusHistory: Array<{
        status: string;
        note?: string;
        timestamp: Date;
    }>;
}
export declare const ShipmentSchema: import("mongoose").Schema<Shipment, import("mongoose").Model<Shipment, any, any, any, Document<unknown, any, Shipment, any, {}> & Shipment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Shipment, Document<unknown, {}, import("mongoose").FlatRecord<Shipment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Shipment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
