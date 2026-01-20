import { Document } from 'mongoose';
export type ProductVariantDocument = ProductVariant & Document;
export declare class ProductVariant {
    productId: string;
    name: string;
    options: Array<{
        name: string;
        value: string;
    }>;
    price?: number;
    compareAtPrice?: number;
    stock: number;
    sku: string;
    image?: string;
    weight?: number;
    isActive: boolean;
    salesCount: number;
}
export declare const ProductVariantSchema: import("mongoose").Schema<ProductVariant, import("mongoose").Model<ProductVariant, any, any, any, Document<unknown, any, ProductVariant, any, {}> & ProductVariant & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductVariant, Document<unknown, {}, import("mongoose").FlatRecord<ProductVariant>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ProductVariant> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
