import { Document } from 'mongoose';
export type ReviewDocument = Review & Document;
export declare enum ReviewStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}
export declare class Review {
    productId: string;
    shopId: string;
    orderId: string;
    customerId: string;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
    status: ReviewStatus;
    isVerifiedPurchase: boolean;
    helpfulCount: number;
    notHelpfulCount: number;
    sellerResponse?: {
        sellerId: string;
        comment: string;
        respondedAt: Date;
    };
    moderatedBy?: string;
    moderatedAt?: Date;
    moderationReason?: string;
}
export declare const ReviewSchema: import("mongoose").Schema<Review, import("mongoose").Model<Review, any, any, any, Document<unknown, any, Review, any, {}> & Review & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, Document<unknown, {}, import("mongoose").FlatRecord<Review>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Review> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
