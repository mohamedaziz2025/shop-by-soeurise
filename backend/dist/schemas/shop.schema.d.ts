import { Document } from 'mongoose';
export type ShopDocument = Shop & Document;
export declare enum ShopStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED"
}
export declare class Shop {
    sellerId: string;
    name: string;
    slug: string;
    description: string;
    logo?: string;
    banner?: string;
    status: ShopStatus;
    categories: string[];
    shippingConfig: {
        enabled: boolean;
        flatRate?: number;
        freeShippingThreshold?: number;
        maxShippingCost?: number;
        estimatedDays: number;
        shippingZones: string[];
    };
    returnPolicy?: string;
    privacyPolicy?: string;
    socialMedia?: {
        instagram?: string;
        facebook?: string;
        website?: string;
    };
    totalProducts: number;
    totalSales: number;
    totalOrders: number;
    averageRating: number;
    totalReviews: number;
    isFeatured: boolean;
    isCompliant: boolean;
    nonComplianceReason?: string;
}
export declare const ShopSchema: import("mongoose").Schema<Shop, import("mongoose").Model<Shop, any, any, any, Document<unknown, any, Shop, any, {}> & Shop & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Shop, Document<unknown, {}, import("mongoose").FlatRecord<Shop>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Shop> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
