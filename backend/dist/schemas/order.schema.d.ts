import { Document } from 'mongoose';
export type OrderDocument = Order & Document;
export declare enum OrderStatus {
    PENDING_PAYMENT = "PENDING_PAYMENT",
    PAID = "PAID",
    PROCESSING = "PROCESSING",
    SHIPPED = "SHIPPED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare class Order {
    orderNumber: string;
    customerId: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    shippingAddress: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
        additionalInfo?: string;
    };
    billingAddress?: {
        firstName: string;
        lastName: string;
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    subtotal: number;
    shippingTotal: number;
    discountTotal: number;
    total: number;
    stripePaymentIntentId?: string;
    stripeChargeId?: string;
    paymentId?: string;
    customerNote?: string;
    adminNote?: string;
    paidAt?: Date;
    cancelledAt?: Date;
    cancellationReason?: string;
    parentOrderId?: string;
    isSubOrder: boolean;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
