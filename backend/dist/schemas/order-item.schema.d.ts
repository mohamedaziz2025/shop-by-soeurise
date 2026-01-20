import { Document } from 'mongoose';
export type OrderItemDocument = OrderItem & Document;
export declare class OrderItem {
    orderId: string;
    shopId: string;
    sellerId: string;
    productId: string;
    variantId?: string;
    productSnapshot: {
        name: string;
        slug?: string;
        image?: string;
        sku?: string;
        variantName?: string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    platformCommissionRate: number;
    platformCommissionAmount: number;
    sellerPayout: number;
    shippingCost: number;
}
export declare const OrderItemSchema: import("mongoose").Schema<OrderItem, import("mongoose").Model<OrderItem, any, any, any, Document<unknown, any, OrderItem, any, {}> & OrderItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, OrderItem, Document<unknown, {}, import("mongoose").FlatRecord<OrderItem>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<OrderItem> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
