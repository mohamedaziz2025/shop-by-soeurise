import { Document } from 'mongoose';
export type SellerProfileDocument = SellerProfile & Document;
export declare enum SellerStatus {
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUSPENDED = "SUSPENDED"
}
export declare class SellerProfile {
    userId: string;
    businessName: string;
    businessDescription: string;
    status: SellerStatus;
    siret: string;
    tvaNumber: string;
    legalForm: string;
    businessAddress: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    businessEmail: string;
    businessPhone: string;
    stripeConnectId?: string;
    stripeOnboardingComplete: boolean;
    documents?: string[];
    commissionRate: number;
    approvedBy?: string;
    approvedAt?: Date;
    rejectionReason?: string;
    totalSales: number;
    totalOrders: number;
    averageRating: number;
    totalReviews: number;
}
export declare const SellerProfileSchema: import("mongoose").Schema<SellerProfile, import("mongoose").Model<SellerProfile, any, any, any, Document<unknown, any, SellerProfile, any, {}> & SellerProfile & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SellerProfile, Document<unknown, {}, import("mongoose").FlatRecord<SellerProfile>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SellerProfile> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
