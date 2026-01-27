import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://soeurise-backend-express:3001/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });

    // Intercepteur de requête pour ajouter le token
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('accessToken');
          if (token) {
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
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
    const { data } = await this.client.get('/auth/me');
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
    // Si shopData contient un logo (File), utiliser FormData
    if (shopData.logo instanceof File) {
      const formData = new FormData();
      
      // Ajouter tous les champs sauf le logo
      Object.keys(shopData).forEach(key => {
        if (key !== 'logo') {
          if (typeof shopData[key] === 'object' && shopData[key] !== null) {
            formData.append(key, JSON.stringify(shopData[key]));
          } else {
            formData.append(key, shopData[key]);
          }
        }
      });
      
      // Ajouter le logo
      formData.append('logo', shopData.logo);
      
      const { data } = await this.client.post('/shops', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } else {
      // Sinon, utiliser JSON normal
      const { data } = await this.client.post('/shops', shopData);
      return data;
    }
  }

  async getMyShop() {
    const { data } = await this.client.get('/shops/seller/my-shop');
    return data;
  }

  async updateMyShop(shopData: any) {
    const { data } = await this.client.put('/shops/seller/my-shop', shopData);
    return data;
  }

  async uploadShopLogo(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await this.client.post('/shops/seller/logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  }

  async getPartners() {
    const { data } = await this.client.get('/shops/partners');
    return data;
  }

  // Products
  async getProducts(filters?: any) {
    // Sanitize filters to avoid sending empty strings or invalid types
    const params: any = {};
    if (filters) {
      Object.keys(filters).forEach((k) => {
        const v = (filters as any)[k];
        if (v === undefined || v === null) return;
        if (typeof v === 'string' && v.trim() === '') return;

        // Convert numeric strings for min/max price
        if ((k === 'minPrice' || k === 'maxPrice') && typeof v === 'string') {
          const n = Number(v);
          if (!Number.isNaN(n)) params[k] = n;
          return;
        }

        // Convert boolean-like strings
        if (k === 'isFeatured' && typeof v === 'string') {
          if (v === 'true' || v === 'false') params[k] = v === 'true';
          return;
        }

        // Tags: if comma-separated string, convert to array
        if (k === 'tags' && typeof v === 'string') {
          params[k] = v.split(',').map((s) => s.trim()).filter(Boolean);
          return;
        }

        params[k] = v;
      });
    }

    const { data } = await this.client.get('/products', { params });
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

  async createProductAdmin(productData: any) {
    // If images are present (File[]), send multipart/form-data
    if (productData?.images && Array.isArray(productData.images) && productData.images.length > 0) {
      const form = new FormData();
      // Append simple fields
      Object.keys(productData).forEach((k) => {
        if (k === 'images' || k === 'variants') return;
        const v = (productData as any)[k];
        if (v === undefined || v === null) return;
        form.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
      });

      // Append variants as JSON
      if (productData.variants) {
        form.append('variants', JSON.stringify(productData.variants));
      }

      // Append multiple images
      productData.images.forEach((file: File, idx: number) => {
        form.append('images', file, file.name || `image-${idx}.jpg`);
      });

      const { data } = await this.client.post('/admin/products', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    }

    const { data } = await this.client.post('/admin/products', productData);
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

  async getDailySales(days: number = 7) {
    const { data } = await this.client.get('/admin/sales/daily', { params: { days } });
    return data;
  }

  async getCategoriesStats() {
    const { data } = await this.client.get('/admin/categories/stats');
    return data;
  }

  async getRecentUsers(limit: number = 20) {
    const { data } = await this.client.get('/admin/users/recent', { params: { limit } });
    return data;
  }

  async getRecentOrders(limit: number = 20) {
    const { data } = await this.client.get('/admin/orders/recent', { params: { limit } });
    return data;
  }

  async getPendingShops() {
    const { data } = await this.client.get('/admin/shops/pending');
    return data;
  }

  async getPendingProducts() {
    const { data } = await this.client.get('/admin/products/pending');
    return data;
  }

  async approveProduct(productId: string, note?: string) {
    const { data } = await this.client.put(`/products/${productId}/approve`, { 
      isApproved: true, 
      note 
    });
    return data;
  }

  async rejectProduct(productId: string, note?: string) {
    const { data } = await this.client.put(`/products/${productId}/approve`, { 
      isApproved: false, 
      note 
    });
    return data;
  }

  async updateShopStatus(shopId: string, status: string, reason?: string) {
    const { data } = await this.client.put(`/shops/${shopId}/status`, { status, reason });
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
    // Backend admin route may return { shops, totalPages, currentPage, total }
    // normalize to return an array of shops for older callers
    if (data && typeof data === 'object' && Array.isArray((data as any).shops)) {
      return (data as any).shops;
    }
    return data;
  }

  async getAllShopsAdmin() {
    // Same as getAllShops, used by admin product creation
    return this.getAllShops();
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

  async addToFavorites(productId: string) {
    const { data } = await this.client.put(`/users/favorites/${productId}`);
    return data;
  }

  async removeFromFavorites(productId: string) {
    const { data } = await this.client.delete(`/users/favorites/${productId}`);
    return data;
  }

  async forgotPassword(email: string) {
    const { data } = await this.client.post('/auth/forgot-password', { email });
    return data;
  }

  async resetPassword(token: string, newPassword: string) {
    const { data } = await this.client.post('/auth/reset-password', { token, newPassword });
    return data;
  }

  async updateShop(shopData: any) {
    return this.updateMyShop(shopData);
  }

  // ============= ADMIN CRUD OPERATIONS =============

  // Admin - Users CRUD
  async getAllUsers(filters?: any) {
    const { data } = await this.client.get('/admin/users', { params: filters });
    return data;
  }

  async getUserById(userId: string) {
    const { data } = await this.client.get(`/admin/users/${userId}`);
    return data;
  }

  async createUser(userData: any) {
    const { data } = await this.client.post('/admin/users', userData);
    return data;
  }

  async updateUser(userId: string, userData: any) {
    const { data } = await this.client.put(`/admin/users/${userId}`, userData);
    return data;
  }

  async deleteUser(userId: string) {
    const { data } = await this.client.delete(`/admin/users/${userId}`);
    return data;
  }

  async updateUserStatus(userId: string, status: string) {
    const { data } = await this.client.put(`/admin/users/${userId}/status`, { status });
    return data;
  }

  async banUser(userId: string, reason?: string) {
    const { data } = await this.client.patch(`/admin/users/${userId}/ban`, { reason });
    return data;
  }

  async unbanUser(userId: string) {
    const { data } = await this.client.patch(`/admin/users/${userId}/unban`, {});
    return data;
  }

  // Admin - Products CRUD
  async getAllProducts(filters?: any) {
    const { data } = await this.client.get('/admin/products', { params: filters });
    return data;
  }

  async getProductById(productId: string) {
    const { data } = await this.client.get(`/admin/products/${productId}`);
    return data;
  }

  async updateProductAdmin(productId: string, productData: any) {
    const { data } = await this.client.put(`/admin/products/${productId}`, productData);
    return data;
  }

  async deleteProductAdmin(productId: string) {
    const { data } = await this.client.delete(`/admin/products/${productId}`);
    return data;
  }

  async approveProductAdmin(productId: string, note?: string) {
    const { data } = await this.client.put(`/admin/products/${productId}/approve`, { 
      isApproved: true, 
      note 
    });
    return data;
  }

  async rejectProductAdmin(productId: string, note?: string) {
    const { data } = await this.client.put(`/admin/products/${productId}/approve`, { 
      isApproved: false, 
      note 
    });
    return data;
  }

  async suspendProduct(productId: string, reason?: string) {
    const { data } = await this.client.put(`/admin/products/${productId}/suspend`, { reason });
    return data;
  }

  // Admin - Shops CRUD  
  async createShopAdmin(shopData: any) {
    // Si shopData contient un logo (File), utiliser FormData
    if (shopData.logo instanceof File) {
      const formData = new FormData();
      
      // Ajouter tous les champs sauf le logo
      Object.keys(shopData).forEach(key => {
        if (key !== 'logo') {
          if (typeof shopData[key] === 'object' && shopData[key] !== null) {
            formData.append(key, JSON.stringify(shopData[key]));
          } else {
            formData.append(key, shopData[key]);
          }
        }
      });
      
      // Ajouter le logo
      formData.append('logo', shopData.logo);
      
      const { data } = await this.client.post('/admin/shops', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } else {
      // Sinon, utiliser JSON normal
      const { data } = await this.client.post('/admin/shops', shopData);
      return data;
    }
  }

  async getShopByIdAdmin(shopId: string) {
    const { data } = await this.client.get(`/admin/shops/${shopId}`);
    return data;
  }

  async updateShopAdmin(shopId: string, shopData: any) {
    const { data } = await this.client.put(`/admin/shops/${shopId}`, shopData);
    return data;
  }

  async deleteShopAdmin(shopId: string) {
    const { data } = await this.client.delete(`/admin/shops/${shopId}`);
    return data;
  }

  async approveShopAdmin(shopId: string) {
    const { data } = await this.client.put(`/admin/shops/${shopId}/approve`);
    return data;
  }

  async rejectShopAdmin(shopId: string, reason: string) {
    const { data } = await this.client.put(`/admin/shops/${shopId}/reject`, { reason });
    return data;
  }

  async suspendShopAdmin(shopId: string, reason?: string) {
    const { data } = await this.client.put(`/admin/shops/${shopId}/suspend`, { reason });
    return data;
  }

  // Admin - Orders CRUD
  async getAllOrders(filters?: any) {
    const { data } = await this.client.get('/admin/orders', { params: filters });
    return data;
  }

  async getOrderByIdAdmin(orderId: string) {
    const { data } = await this.client.get(`/admin/orders/${orderId}`);
    return data;
  }

  async updateOrderAdmin(orderId: string, orderData: any) {
    const { data } = await this.client.put(`/admin/orders/${orderId}`, orderData);
    return data;
  }

  async updateOrderStatusAdmin(orderId: string, status: string) {
    const { data } = await this.client.put(`/admin/orders/${orderId}/status`, { status });
    return data;
  }

  async cancelOrderAdmin(orderId: string, reason?: string) {
    const { data } = await this.client.put(`/admin/orders/${orderId}/cancel`, { reason });
    return data;
  }

  async deleteOrderAdmin(orderId: string) {
    const { data } = await this.client.delete(`/admin/orders/${orderId}`);
    return data;
  }

  // Admin - Reviews CRUD
  async getAllReviews(filters?: any) {
    const { data } = await this.client.get('/admin/reviews', { params: filters });
    return data;
  }

  async deleteReview(reviewId: string) {
    const { data } = await this.client.delete(`/admin/reviews/${reviewId}`);
    return data;
  }

  async moderateReview(reviewId: string, action: 'approve' | 'reject') {
    const { data } = await this.client.put(`/admin/reviews/${reviewId}/moderate`, { action });
    return data;
  }
}

export const api = new ApiClient();
