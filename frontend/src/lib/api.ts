import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://72.62.71.97:4000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur de requête pour ajouter le token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur de réponse pour gérer le refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (typeof window !== 'undefined') {
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
              try {
                const { data } = await axios.post(`${API_URL}/auth/refresh`, {
                  refreshToken,
                });

                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return this.client(originalRequest);
              } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
              }
            }
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(email: string, password: string) {
    const { data } = await this.client.post('/auth/login', { email, password });
    return data;
  }

  async register(userData: any) {
    const { data } = await this.client.post('/auth/register', userData);
    return data;
  }

  async logout() {
    const { data } = await this.client.post('/auth/logout');
    return data;
  }

  async getCurrentUser() {
    const { data } = await this.client.post('/auth/me');
    return data;
  }

  async verifyEmail(token: string) {
    const { data } = await this.client.get(`/auth/verify-email/${token}`);
    return data;
  }

  async resendVerificationEmail(email: string) {
    const { data } = await this.client.post('/auth/resend-verification', { email });
    return data;
  }

  // Shops
  async getShops(filters?: any) {
    const { data } = await this.client.get('/shops', { params: filters });
    return data;
  }

  async getShopBySlug(slug: string) {
    const { data } = await this.client.get(`/shops/slug/${slug}`);
    return data;
  }

  async createShop(shopData: any) {
    const { data } = await this.client.post('/shops', shopData);
    return data;
  }

  async getMyShop() {
    const { data } = await this.client.get('/shops/seller/my-shop');
    return data;
  }

  async updateMyShop(shopData: any) {
    const { data } = await this.client.put('/shops/seller/my-shop', shopData);
    return data;
  }

  // Products
  async getProducts(filters?: any) {
    const { data } = await this.client.get('/products', { params: filters });
    return data;
  }

  async getProductBySlug(slug: string) {
    const { data } = await this.client.get(`/products/slug/${slug}`);
    return data;
  }

  async createProduct(productData: any) {
    const { data } = await this.client.post('/products', productData);
    return data;
  }

  async getMyProducts() {
    const { data } = await this.client.get('/products/seller/my-products');
    return data;
  }

  async updateProduct(productId: string, productData: any) {
    const { data } = await this.client.put(`/products/${productId}`, productData);
    return data;
  }

  async deleteProduct(productId: string) {
    const { data } = await this.client.delete(`/products/${productId}`);
    return data;
  }

  // Cart
  async getCart(guestId?: string) {
    const { data } = await this.client.get('/cart', { params: { guestId } });
    return data;
  }

  async addToCart(item: any) {
    const { data } = await this.client.post('/cart/add', item);
    return data;
  }

  async updateCartItem(productId: string, variantId: string | undefined, quantity: number, guestId?: string) {
    const { data } = await this.client.put(
      `/cart/item/${productId}`,
      { quantity },
      { params: { variantId, guestId } }
    );
    return data;
  }

  async removeFromCart(productId: string, variantId?: string, guestId?: string) {
    const { data } = await this.client.delete(`/cart/item/${productId}`, {
      params: { variantId, guestId },
    });
    return data;
  }

  async clearCart(guestId?: string) {
    const { data } = await this.client.delete('/cart/clear', { params: { guestId } });
    return data;
  }

  // Orders
  async createOrder(orderData: any) {
    const { data } = await this.client.post('/orders', orderData);
    return data;
  }

  // Cart merge (after login) - merge guest cart into authenticated user's cart
  async mergeGuestCart(guestId: string) {
    const { data } = await this.client.post('/cart/merge', { guestId });
    return data;
  }

  async getMyOrders() {
    const { data } = await this.client.get('/orders/my-orders');
    return data;
  }

  async getOrderById(orderId: string) {
    const { data } = await this.client.get(`/orders/${orderId}`);
    return data;
  }

  // Payments
  async createPaymentIntent(orderId: string) {
    const { data } = await this.client.post('/payments/create-intent', { orderId });
    return data;
  }

  // Reviews
  async getProductReviews(productId: string) {
    const { data } = await this.client.get(`/reviews/product/${productId}`);
    return data;
  }

  async createReview(reviewData: any) {
    const { data } = await this.client.post('/reviews', reviewData);
    return data;
  }

  // Users
  async updateProfile(userData: any) {
    const { data } = await this.client.put('/users/profile', userData);
    return data;
  }

  // Seller
  async getSellerStats() {
    const { data } = await this.client.get('/shops/seller/stats');
    return data;
  }

  // Admin
  async getAdminStats() {
    const { data } = await this.client.get('/admin/dashboard/stats');
    return data;
  }

  async getDashboardStats() {
    const { data } = await this.client.get('/admin/dashboard/stats');
    return data;
  }

  async getPendingShops() {
    const { data } = await this.client.get('/admin/shops/pending');
    return data;
  }

  async approveShop(shopId: string) {
    const { data } = await this.client.put(`/shops/${shopId}/status`, { status: 'APPROVED' });
    return data;
  }

  async rejectShop(shopId: string, reason: string) {
    const { data } = await this.client.put(`/shops/${shopId}/status`, { status: 'REJECTED', reason });
    return data;
  }

  async suspendShop(shopId: string) {
    const { data } = await this.client.put(`/shops/${shopId}/status`, { status: 'SUSPENDED' });
    return data;
  }

  async getAllShops() {
    const { data } = await this.client.get('/admin/shops');
    return data;
  }

  async getSellerOrders() {
    const { data } = await this.client.get('/orders/seller/orders');
    return data;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const { data } = await this.client.put(`/orders/${orderId}/status`, { status });
    return data;
  }

  async getOrder(orderId: string) {
    const { data } = await this.client.get(`/orders/${orderId}`);
    return data;
  }

  async getFavorites() {
    const { data } = await this.client.get('/users/favorites');
    return data;
  }

  async updateShop(shopData: any) {
    return this.updateMyShop(shopData);
  }
}

export const api = new ApiClient();
