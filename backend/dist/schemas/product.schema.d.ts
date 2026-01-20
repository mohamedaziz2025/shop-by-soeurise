import { Document } from 'mongoose';
export type ProductDocument = Product & Document;
export declare enum ProductStatus {
    DRAFT = "DRAFT",
    ACTIVE = "ACTIVE",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    ARCHIVED = "ARCHIVED"
}
export declare class Product {
    shopId: string;
    sellerId: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    status: ProductStatus;
    price: number;
    compareAtPrice?: number;
    discountPercent?: number;
    mainImage: string;
    images: string[];
    category: string;
    tags: string[];
    stock: number;
    sku?: string;
    dimensions?: {
        weight?: number;
        length?: number;
        width?: number;
        height?: number;
    };
    hasVariants: boolean;
    metaTitle?: string;
    metaDescription?: string;
    viewsCount: number;
    salesCount: number;
    averageRating: number;
    reviewsCount: number;
    isFeatured: boolean;
    isApproved: boolean;
    approvalNote?: string;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Product> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
