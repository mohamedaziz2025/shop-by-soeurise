import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
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
}
