export declare class AddToCartDto {
    productId: string;
    variantId?: string;
    quantity: number;
}
export declare class UpdateCartItemDto {
    quantity: number;
}
export declare class RemoveFromCartDto {
    productId: string;
    variantId?: string;
}
