import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import slugify from 'slugify';
import { Shop, ShopDocument } from '../schemas/shop.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Payment, PaymentDocument } from '../schemas/payment.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  /**
   * Dashboard global - Statistiques générales
   */
  async getDashboardStats() {
    const [
      totalUsers,
      totalShops,
      totalProducts,
      totalOrders,
      pendingShops,
      pendingProducts,
      activeShops,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.shopModel.countDocuments({ status: 'ACTIVE' }),
      this.productModel.countDocuments({ status: 'ACTIVE' }),
      this.orderModel.countDocuments({ isSubOrder: false }),
      this.shopModel.countDocuments({ status: 'PENDING_APPROVAL' }),
      this.productModel.countDocuments({ isApproved: false }),
      this.shopModel.countDocuments({ status: 'ACTIVE' }),
    ]);

    // Revenus du mois en cours
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = await this.orderModel.find({
      isSubOrder: false,
      paymentStatus: 'PAID',
      paidAt: { $gte: startOfMonth },
    });

    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

    // Commission plateforme du mois
    const monthlyPayments = await this.paymentModel.find({
      status: 'SUCCEEDED',
      paidAt: { $gte: startOfMonth },
    });

    const monthlyCommission = monthlyPayments.reduce(
      (sum, payment) => sum + payment.totalPlatformCommission,
      0,
    );

    // Nouveaux utilisateurs ce mois
    const newUsersThisMonth = await this.userModel.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Commandes en attente
    const pendingOrders = await this.orderModel.countDocuments({
      isSubOrder: false,
      status: { $in: ['PENDING', 'PROCESSING'] },
    });

    return {
      totalUsers,
      totalShops,
      activeShops,
      totalProducts,
      totalOrders,
      pendingShops,
      pendingProducts,
      monthlyRevenue,
      monthlyCommission,
      newUsersThisMonth,
      pendingOrders,
    };
  }

  /**
   * Statistiques des ventes par période
   */
  async getSalesStats(startDate: Date, endDate: Date) {
    const orders = await this.orderModel.find({
      isSubOrder: false,
      paymentStatus: 'PAID',
      paidAt: { $gte: startDate, $lte: endDate },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Commission plateforme
    const payments = await this.paymentModel.find({
      status: 'SUCCEEDED',
      paidAt: { $gte: startDate, $lte: endDate },
    });

    const totalCommission = payments.reduce(
      (sum, payment) => sum + payment.totalPlatformCommission,
      0,
    );

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalCommission,
    };
  }

  /**
   * Top boutiques par chiffre d'affaires
   */
  async getTopShops(limit: number = 10) {
    return this.shopModel
      .find({ status: 'ACTIVE' })
      .sort({ totalSales: -1 })
      .limit(limit)
      .select('name slug totalSales totalOrders averageRating');
  }

  /**
   * Top produits par ventes
   */
  async getTopProducts(limit: number = 10) {
    return this.productModel
      .find({ status: 'ACTIVE' })
      .sort({ salesCount: -1 })
      .limit(limit)
      .populate('shopId', 'name slug')
      .select('name slug mainImage salesCount averageRating price');
  }

  /**
   * Boutiques en attente de validation
   */
  async getPendingShops() {
    return this.shopModel
      .find({ status: 'PENDING_APPROVAL' })
      .populate('sellerId', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }

  /**
   * Produits en attente d'approbation
   */
  async getPendingProducts() {
    return this.productModel
      .find({ isApproved: false })
      .populate('shopId', 'name slug')
      .populate('sellerId', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }

  /**
   * Utilisateurs récents
   */
  async getRecentUsers(limit: number = 20) {
    return this.userModel
      .find()
      .select('-password -refreshToken')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Commandes récentes
   */
  async getRecentOrders(limit: number = 20) {
    return this.orderModel
      .find({ isSubOrder: false })
      .populate('customerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Rapport détaillé des commissions
   */
  async getCommissionsReport(startDate: Date, endDate: Date) {
    const payments = await this.paymentModel
      .find({
        status: 'SUCCEEDED',
        paidAt: { $gte: startDate, $lte: endDate },
      })
      .populate('orderId')
      .sort({ paidAt: -1 });

    const commissionsByShop = new Map();

    for (const payment of payments) {
      for (const split of payment.splits) {
        const shopId = split.shopId.toString();

        if (!commissionsByShop.has(shopId)) {
          commissionsByShop.set(shopId, {
            shopId,
            totalSales: 0,
            totalCommission: 0,
            orderCount: 0,
          });
        }

        const shopData = commissionsByShop.get(shopId);
        shopData.totalSales += split.amount;
        shopData.totalCommission += split.platformCommission;
        shopData.orderCount += 1;
      }
    }

    return Array.from(commissionsByShop.values());
  }

  /**
   * Ventes quotidiennes
   */
  async getDailySales(days: number = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const orders = await this.orderModel.find({
      isSubOrder: false,
      paymentStatus: 'PAID',
      paidAt: { $gte: startDate },
    });

    // Grouper par jour
    const salesByDay = new Map();
    const dateFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      date.setHours(0, 0, 0, 0);
      const dayLabel = dateFormatter.format(date);
      salesByDay.set(date.toDateString(), {
        label: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
        value: 0,
        orders: 0,
      });
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.paidAt);
      orderDate.setHours(0, 0, 0, 0);
      const dateKey = orderDate.toDateString();

      if (salesByDay.has(dateKey)) {
        const dayData = salesByDay.get(dateKey);
        dayData.value += order.total;
        dayData.orders += 1;
      }
    });

    return Array.from(salesByDay.values());
  }

  /**
   * Statistiques par catégorie
   */
  async getCategoriesStats() {
    const products = await this.productModel.find({ status: 'ACTIVE' });

    const categoriesMap = new Map();
    let totalProducts = products.length;

    products.forEach((product) => {
      const category = product.category || 'Non catégorisé';
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, {
          name: category,
          count: 0,
          totalSales: 0,
        });
      }

      const catData = categoriesMap.get(category);
      catData.count += 1;
      catData.totalSales += product.salesCount || 0;
    });

    const categories = Array.from(categoriesMap.values())
      .map((cat) => ({
        ...cat,
        percentage: totalProducts > 0 ? Math.round((cat.count / totalProducts) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return categories;
  }

  async getAllUsers(filters?: any) {
    const query = {};
    if (filters?.role) {
      query['role'] = filters.role;
    }
    if (filters?.status) {
      query['status'] = filters.status;
    }
    return this.userModel.find(query).sort({ createdAt: -1 });
  }

  async getAllShops() {
    return this.shopModel
      .find()
      .populate('sellerId', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }

  async createShopForUser(sellerId: string, createShopDto: any) {
    // Vérifier que l'utilisateur existe
    const user = await this.userModel.findById(sellerId);
    if (!user) {
      throw new Error('Utilisateur introuvable');
    }

    // Vérifier si le vendeur a déjà une boutique
    const existingShop = await this.shopModel.findOne({ sellerId });
    if (existingShop) {
      throw new Error('L\'utilisateur a déjà une boutique');
    }

    // Si l'utilisateur est CLIENT, le passer en SELLER
    if (user.role === UserRole.CLIENT) {
      user.role = UserRole.SELLER;
      await user.save();
    }

    // Vérifier que l'utilisateur est maintenant vendeur
    if (user.role !== UserRole.SELLER) {
      throw new Error('Seuls les vendeurs peuvent avoir une boutique');
    }

    // Générer le slug et vérifier l'unicité
    const slug = slugify(createShopDto.name || createShopDto.title || 'shop', { lower: true, strict: true });
    const existingSlug = await this.shopModel.findOne({ slug });
    if (existingSlug) {
      throw new Error('Ce nom de boutique est déjà utilisé');
    }

    const shop = new this.shopModel({
      ...createShopDto,
      sellerId,
      slug,
    });

    await shop.save();
    return shop;
  }

  async createProductForShop(productData: any) {
    // Vérifier que la boutique existe
    const shop = await this.shopModel.findById(productData.shopId);
    if (!shop) {
      throw new Error('Boutique non trouvée');
    }

    // Créer le produit
    const product = new this.productModel({
      ...productData,
      shopId: shop._id,
      isApproved: true, // Les produits créés par l'admin sont approuvés d'office
      createdBy: 'ADMIN',
    });

    await product.save();

    // Mettre à jour le compteur de produits de la boutique
    await this.shopModel.findByIdAndUpdate(shop._id, {
      $inc: { totalProducts: 1 },
    });

    return product;
  }

  // ============= USER MANAGEMENT =============

  async getUserDetail(userId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Récupérer ses commandes
    const orders = await this.orderModel.find({ userId }).sort({ createdAt: -1 });
    
    // Récupérer ses informations d'achat
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const orderCount = orders.length;
    const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

    return {
      ...user.toObject(),
      totalSpent,
      orderCount,
      lastOrderDate,
      recentOrders: orders.slice(0, 5),
    };
  }

  async updateUser(userId: string, userData: any) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
      },
      { new: true },
    );

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  }

  async deleteUser(userId: string) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
    return { message: 'Utilisateur supprimé avec succès' };
  }

  async banUser(userId: string, reason?: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        status: 'SUSPENDED',
        suspendedReason: reason || 'Banni par l\'administrateur',
      },
      { new: true },
    );

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  }

  async unbanUser(userId: string) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        status: 'ACTIVE',
        suspendedReason: null,
      },
      { new: true },
    );

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return user;
  }

  // ============= SHOP MANAGEMENT =============

  async getShopDetail(shopId: string) {
    const shop = await this.shopModel
      .findById(shopId)
      .populate('sellerId', 'firstName lastName email');

    if (!shop) {
      throw new Error('Boutique non trouvée');
    }

    // Récupérer les produits de la boutique
    const products = await this.productModel.find({ shopId }).sort({ createdAt: -1 });

    // Récupérer les commandes de la boutique
    const orders = await this.orderModel.find({ 'items.shopId': shopId }).sort({ createdAt: -1 });

    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

    return {
      ...shop.toObject(),
      productsCount: products.length,
      ordersCount: orders.length,
      totalSales,
      recentProducts: products.slice(0, 5),
      recentOrders: orders.slice(0, 5),
    };
  }

  async updateShop(shopId: string, shopData: any) {
    const shop = await this.shopModel.findByIdAndUpdate(
      shopId,
      {
        name: shopData.name,
        description: shopData.description,
        category: shopData.category,
        location: shopData.location,
      },
      { new: true },
    );

    if (!shop) {
      throw new Error('Boutique non trouvée');
    }

    return shop;
  }

  async deleteShop(shopId: string) {
    const shop = await this.shopModel.findByIdAndDelete(shopId);
    if (!shop) {
      throw new Error('Boutique non trouvée');
    }

    // Supprimer aussi les produits de la boutique
    await this.productModel.deleteMany({ shopId });

    return { message: 'Boutique supprimée avec succès' };
  }

  async approveShop(shopId: string) {
    const shop = await this.shopModel.findByIdAndUpdate(
      shopId,
      { status: 'APPROVED' },
      { new: true },
    );

    if (!shop) {
      throw new Error('Boutique non trouvée');
    }

    return shop;
  }

  async rejectShop(shopId: string, reason: string) {
    const shop = await this.shopModel.findByIdAndUpdate(
      shopId,
      {
        status: 'REJECTED',
        rejectionReason: reason || 'Rejeté par l\'administrateur',
      },
      { new: true },
    );

    if (!shop) {
      throw new Error('Boutique non trouvée');
    }

    return shop;
  }

  async suspendShop(shopId: string, reason?: string) {
    const shop = await this.shopModel.findByIdAndUpdate(
      shopId,
      {
        status: 'SUSPENDED',
        suspendedReason: reason || 'Suspendu par l\'administrateur',
      },
      { new: true },
    );

    if (!shop) {
      throw new Error('Boutique non trouvée');
    }

    return shop;
  }

  async activateShop(shopId: string) {
    const shop = await this.shopModel.findByIdAndUpdate(
      shopId,
      {
        status: 'APPROVED',
        suspendedReason: null,
      },
      { new: true },
    );

    if (!shop) {
      throw new Error('Boutique non trouvée');
    }

    return shop;
  }
