import { Document } from 'mongoose';
export type PaymentDocument = Payment & Document;
export declare enum PaymentMethod {
    CARD = "CARD",
    SEPA = "SEPA",
    OTHER = "OTHER"
}
export declare enum PaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    SUCCEEDED = "SUCCEEDED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
}
export declare class Payment {
    orderId: string;
    customerId: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    stripePaymentIntentId: string;
    stripeChargeId?: string;
    stripePaymentMethodId?: string;
    splits: Array<{
        shopId: string;
        sellerId: string;
        amount: number;
        platformCommission: number;
        sellerPayout: number;
        stripeTransferId?: string;
        status: string;
    }>;
    totalPlatformCommission: number;
    refundedAmount: number;
    refunds?: Array<{
        amount: number;
        reason?: string;
        stripeRefundId?: string;
        refundedAt: Date;
    }>;
    customerEmail?: string;
    customerName?: string;
    paidAt?: Date;
    failedAt?: Date;
    failureReason?: string;
    webhookEvents?: string[];
}
export declare const PaymentSchema: import("mongoose").Schema<Payment, import("mongoose").Model<Payment, any, any, any, Document<unknown, any, Payment, any, {}> & Payment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payment, Document<unknown, {}, import("mongoose").FlatRecord<Payment>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Payment> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
