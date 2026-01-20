import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Shop, ShopDocument, ShopStatus } from '../schemas/shop.schema';
import { User, UserDocument, UserRole } from '../schemas/user.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Order, OrderDocument } from '../schemas/order.schema';
import { CreateShopDto, UpdateShopDto } from './dto/shop.dto';

@Injectable()
export class ShopsService {
  constructor(
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  /**
   * Créer une boutique (SELLER ou CLIENT qui devient SELLER)
   */
  async create(sellerId: string, createShopDto: CreateShopDto) {
    // Vérifier que l'utilisateur existe
    const user = await this.userModel.findById(sellerId);

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Vérifier si le vendeur a déjà une boutique
    const existingShop = await this.shopModel.findOne({ sellerId });

    if (existingShop) {
      throw new BadRequestException('Vous avez déjà une boutique');
    }

    // Si l'utilisateur est CLIENT, le passer en SELLER
    if (user.role === UserRole.CLIENT) {
      user.role = UserRole.SELLER;
      await user.save();
    }

    // Vérifier que l'utilisateur est maintenant vendeur
    if (user.role !== UserRole.SELLER) {
      throw new ForbiddenException('Seuls les vendeurs peuvent créer une boutique');
    }

    // Générer le slug
    const slug = slugify(createShopDto.name, { lower: true, strict: true });

    // Vérifier l'unicité du slug
    const existingSlug = await this.shopModel.findOne({ slug });

    if (existingSlug) {
      throw new BadRequestException('Ce nom de boutique est déjà utilisé');
    }

    const shop = new this.shopModel({
      ...createShopDto,
      sellerId,
      slug,
    });

    await shop.save();
    return shop;
  }

  /**
   * Récupérer toutes les boutiques (publiques)
   */
  async findAll(filters?: {
    status?: string;
    category?: string;
    isFeatured?: boolean;
  }) {
    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.category) {
      query.categories = filters.category;
    }

    if (filters?.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured;
    }

    return this.shopModel
      .find(query)
      .populate('sellerId', 'firstName lastName email')
      .sort({ isFeatured: -1, averageRating: -1, createdAt: -1 });
  }

  /**
   * Récupérer une boutique par slug (publique)
   */
  async findBySlug(slug: string) {
    const shop = await this.shopModel
      .findOne({ slug, status: 'ACTIVE' })
      .populate('sellerId', 'firstName lastName email');

    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }

    return shop;
  }

  /**
   * Récupérer une boutique par ID
   */
  async findById(id: string) {
    const shop = await this.shopModel
      .findById(id)
      .populate('sellerId', 'firstName lastName email');

    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }

    return shop;
  }

  /**
   * Récupérer la boutique d'un vendeur
   */
  async findBySellerId(sellerId: string) {
    const shop = await this.shopModel.findOne({ sellerId });

    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }

    return shop;
  }

  /**
   * Mettre à jour une boutique (SELLER)
   */
  async update(sellerId: string, updateShopDto: UpdateShopDto) {
    const shop = await this.shopModel.findOne({ sellerId });

    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }

    // Si le nom est modifié, régénérer le slug
    if (updateShopDto.name && updateShopDto.name !== shop.name) {
      const newSlug = slugify(updateShopDto.name, { lower: true, strict: true });

      const existingSlug = await this.shopModel.findOne({
        slug: newSlug,
        _id: { $ne: shop._id },
      });

      if (existingSlug) {
        throw new BadRequestException('Ce nom de boutique est déjà utilisé');
      }

      shop.slug = newSlug;
    }

    Object.assign(shop, updateShopDto);
    await shop.save();

    return shop;
  }

  /**
   * Supprimer une boutique (SELLER)
   */
  async delete(sellerId: string) {
    const shop = await this.shopModel.findOne({ sellerId });

    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }

    // Archiver au lieu de supprimer
    shop.status = ShopStatus.INACTIVE;
    await shop.save();

    return { message: 'Boutique archivée avec succès' };
  }

  /**
   * Mettre à jour le statut d'une boutique (ADMIN)
   */
  async updateStatus(shopId: string, status: string) {
    const shop = await this.shopModel.findByIdAndUpdate(
      shopId,
      { status },
      { new: true },
    );

    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }

    return shop;
  }

  /**
   * Mettre en avant une boutique (ADMIN)
   */
  async toggleFeatured(shopId: string) {
    const shop = await this.shopModel.findById(shopId);

    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }

    shop.isFeatured = !shop.isFeatured;
    await shop.save();

    return shop;
  }

  /**
   * Marquer une boutique comme non conforme (ADMIN)
   */
  async setCompliance(shopId: string, isCompliant: boolean, reason?: string) {
    const shop = await this.shopModel.findByIdAndUpdate(
      shopId,
      {
        isCompliant,
        nonComplianceReason: isCompliant ? undefined : reason,
      },
      { new: true },
    );

    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }

    return shop;
  }

  /**
   * Statistiques vendeur pour le dashboard CRM
   */
  async getSellerStats(sellerId: string) {
    const shop = await this.shopModel.findOne({ sellerId });

    if (!shop) {
      throw new NotFoundException('Boutique introuvable');
    }

    // Période actuelle (mois en cours)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // Produits
    const [activeProducts, totalProducts] = await Promise.all([
      this.productModel.countDocuments({ shopId: shop._id, status: 'ACTIVE' }),
      this.productModel.countDocuments({ shopId: shop._id }),
    ]);

    // Commandes
    const allOrders: any[] = await this.orderModel.find({
      'items.shopId': shop._id,
    }).lean();

    const ordersThisMonth = allOrders.filter(
      (order) => new Date(order.createdAt) >= startOfMonth,
    );

    // Calcul du revenu du mois
    const revenue = ordersThisMonth.reduce((sum, order) => {
      const shopItems = order.items.filter(
        (item: any) => item.shopId.toString() === shop._id.toString(),
      );
      return (
        sum +
        shopItems.reduce((itemSum: number, item: any) => itemSum + item.subtotal, 0)
      );
    }, 0);

    // Commandes par statut
    const pendingOrders = allOrders.filter(
      (o) => o.status === 'PENDING_PAYMENT' || o.status === 'PROCESSING',
    ).length;
    const inProgressOrders = allOrders.filter(
      (o) => o.status === 'SHIPPED',
    ).length;
    const deliveredOrders = allOrders.filter((o) => o.status === 'DELIVERED').length;
    const cancelledOrders = allOrders.filter((o) => o.status === 'CANCELLED').length;

    // Top produits
    const products = await this.productModel
      .find({ shopId: shop._id, status: 'ACTIVE' })
      .sort({ salesCount: -1 })
      .limit(5)
      .select('name mainImage price salesCount');

    // Commandes récentes
    const recentOrders: any[] = await this.orderModel
      .find({ 'items.shopId': shop._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customerId', 'firstName lastName')
      .lean();

    // Formater les commandes récentes
    const formattedOrders = recentOrders.map((order: any) => {
      const shopItems = order.items.filter(
        (item: any) => item.shopId.toString() === shop._id.toString(),
      );
      const totalAmount = shopItems.reduce(
        (sum: number, item: any) => sum + item.subtotal,
        0,
      );

      return {
        _id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount,
        createdAt: order.createdAt,
        customerName: order.customerId
          ? `${order.customerId.firstName} ${order.customerId.lastName}`
          : 'Client',
      };
    });

    // Clients uniques
    const uniqueCustomers = new Set(
      allOrders.map((order) => order.customerId?.toString()).filter(Boolean),
    );

    return {
      revenue,
      ordersCount: ordersThisMonth.length,
      activeProducts,
      totalProducts,
      averageRating: shop.averageRating || 0,
      totalReviews: shop.totalReviews || 0,
      pendingOrders,
      inProgressOrders,
      deliveredOrders,
      cancelledOrders,
      topProducts: products,
      recentOrders: formattedOrders,
      totalCustomers: uniqueCustomers.size,
      returningCustomers: 0, // TODO: Calculer le vrai taux de clients récurrents
    };
  }
}
