import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: any): Promise<{
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
    addToCart(user: any, addToCartDto: AddToCartDto): Promise<{
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
    updateCartItem(user: any, productId: string, variantId: string, updateDto: UpdateCartItemDto): Promise<{
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
    removeFromCart(user: any, productId: string, variantId: string): Promise<{
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
    clearCart(user: any): Promise<{
        message: string;
    }>;
}
