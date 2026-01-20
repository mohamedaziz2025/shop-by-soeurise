import { Document } from 'mongoose';
export type PayoutDocument = Payout & Document;
export declare enum PayoutStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    PAID = "PAID",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare class Payout {
    sellerId: string;
    shopId: string;
    status: PayoutStatus;
    amount: number;
    currency: string;
    stripeConnectAccountId: string;
    stripeTransferId?: string;
    stripePayoutId?: string;
    periodStart: Date;
    periodEnd: Date;
    breakdown: {
        totalSales: number;
        totalOrders: number;
        platformCommission: number;
        shippingReimbursement: number;
        adjustments: number;
    };
    orderIds: string[];
    paidAt?: Date;
    failedAt?: Date;
    failureReason?: string;
    paymentMethod: string;
    adminNote?: string;
    sellerNote?: string;
}
export declare const PayoutSchema: import("mongoose").Schema<Payout, import("mongoose").Model<Payout, any, any, any, Document<unknown, any, Payout, any, {}> & Payout & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payout, Document<unknown, {}, import("mongoose").FlatRecord<Payout>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Payout> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
