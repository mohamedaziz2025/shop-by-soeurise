import { create } from 'zustand';
import { api } from '@/lib/api';

interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  productSnapshot: {
    name: string;
    image: string;
    slug: string;
  };
}

interface CartState {
  cart: any | null;
  loading: boolean;
  items: CartItem[];
  itemsByShop: any[];
  totalItems: number;
  subtotal: number;
  shippingTotal: number;
  total: number;
  fetchCart: () => Promise<void>;
  addItem: (data: { productId: string; variantId?: string; quantity: number }) => Promise<void>;
  updateItemQuantity: (productId: string, variantId: string | undefined, quantity: number) => Promise<void>;
  removeItem: (productId: string, variantId: string | undefined) => Promise<void>;
  setCart: (cartData: any) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  loading: false,
  items: [],
  itemsByShop: [],
  totalItems: 0,
  subtotal: 0,
  shippingTotal: 0,
  total: 0,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const cartData = await api.getCart();
      set({
        cart: cartData,
        items: cartData.items || [],
        itemsByShop: cartData.itemsByShop || [],
        totalItems: cartData.items?.length || 0,
        subtotal: cartData.totals?.subtotal || 0,
        shippingTotal: cartData.totals?.shipping || 0,
        total: cartData.totals?.total || 0,
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (data) => {
    try {
      await api.addToCart(data);
      await get().fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  },

  updateItemQuantity: async (productId, variantId, quantity) => {
    try {
      await api.updateCartItem(productId, variantId, quantity);
      await get().fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  removeItem: async (productId, variantId) => {
    try {
      await api.removeFromCart(productId, variantId);
      await get().fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  },

  setCart: (cartData) => {
    set({
      cart: cartData,
      items: cartData.items || [],
      itemsByShop: cartData.itemsByShop || [],
      totalItems: cartData.items?.length || 0,
      subtotal: cartData.totals?.subtotal || 0,
      shippingTotal: cartData.totals?.shipping || 0,
      total: cartData.totals?.total || 0,
    });
  },

  clearCart: () => {
    set({
      cart: null,
      items: [],
      itemsByShop: [],
      totalItems: 0,
      subtotal: 0,
      shippingTotal: 0,
      total: 0,
    });
  },
}));
