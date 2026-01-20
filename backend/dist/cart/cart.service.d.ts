import { Model } from 'mongoose';
import { CartDocument } from '../schemas/cart.schema';
import { ProductDocument } from '../schemas/product.schema';
import { ProductVariantDocument } from '../schemas/product-variant.schema';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartService {
    private cartModel;
    private productModel;
    private variantModel;
    constructor(cartModel: Model<CartDocument>, productModel: Model<ProductDocument>, variantModel: Model<ProductVariantDocument>);
    getCart(userId: string): Promise<{
        items: {
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
        }[];
        itemsByShop: any[];
        totalItems: number;
        subtotal: any;
        shippingTotal: any;
        total: any;
    }>;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<{
        items: {
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
        }[];
        itemsByShop: any[];
        totalItems: number;
        subtotal: any;
        shippingTotal: any;
        total: any;
    }>;
    updateCartItem(userId: string, productId: string, variantId: string | undefined, updateDto: UpdateCartItemDto): Promise<{
        items: {
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
        }[];
        itemsByShop: any[];
        totalItems: number;
        subtotal: any;
        shippingTotal: any;
        total: any;
    }>;
    removeFromCart(userId: string, productId: string, variantId?: string): Promise<{
        items: {
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
        }[];
        itemsByShop: any[];
        totalItems: number;
        subtotal: any;
        shippingTotal: any;
        total: any;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
    private calculateCartTotals;
}
