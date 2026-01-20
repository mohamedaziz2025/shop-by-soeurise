import { Document } from 'mongoose';
export type CartDocument = Cart & Document;
export declare class Cart {
    userId: string;
    items: Array<{
        productId: string;
        variantId?: string;
        shopId: string;
        quantity: number;
        price: number;
        productSnapshot: {
            name: string;
            image: string;
            slug: string;
        };
        addedAt: Date;
    }>;
    subtotal: number;
    totalItems: number;
    lastActivityAt: Date;
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, Document<unknown, any, Cart, any, {}> & Cart & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, import("mongoose").FlatRecord<Cart>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Cart> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
