import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { Shop, ShopDocument } from '../schemas/shop.schema';
import { OrderItem, OrderItemDocument } from '../schemas/order-item.schema';
import { CreateReviewDto, RespondToReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    @InjectModel(OrderItem.name) private orderItemModel: Model<OrderItemDocument>,
  ) {}

  /**
   * Créer un avis (CLIENT)
   */
  async create(customerId: string, createReviewDto: CreateReviewDto) {
    // Vérifier que le client a bien acheté le produit
    const orderItem = await this.orderItemModel.findOne({
      orderId: createReviewDto.orderId,
      productId: createReviewDto.productId,
    }).populate('orderId');

    if (!orderItem) {
      throw new BadRequestException('Vous n\'avez pas acheté ce produit');
    }

    const order = orderItem.orderId as any;

    if (order.customerId.toString() !== customerId) {
      throw new BadRequestException('Cette commande ne vous appartient pas');
    }

    // Vérifier qu'il n'a pas déjà laissé un avis
    const existingReview = await this.reviewModel.findOne({
      customerId,
      productId: createReviewDto.productId,
      orderId: createReviewDto.orderId,
    });

    if (existingReview) {
      throw new BadRequestException('Vous avez déjà laissé un avis pour ce produit');
    }

    // Récupérer le produit
    const product = await this.productModel.findById(createReviewDto.productId);

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    // Créer l'avis
    const review = new this.reviewModel({
      ...createReviewDto,
      customerId,
      shopId: product.shopId,
      isVerifiedPurchase: true,
    });

    await review.save();

    // Mettre à jour les statistiques du produit
    await this.updateProductStats(product._id.toString());

    // Mettre à jour les statistiques de la boutique
    await this.updateShopStats(product.shopId.toString());

    return review;
  }

  /**
   * Récupérer les avis d'un produit
   */
  async findByProductId(productId: string, filters?: { status?: string }) {
    const query: any = { productId };

    if (filters?.status) {
      query.status = filters.status;
    } else {
      query.status = 'APPROVED'; // Par défaut, seulement les approuvés
    }

    return this.reviewModel
      .find(query)
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  /**
   * Récupérer les avis d'une boutique
   */
  async findByShopId(shopId: string) {
    return this.reviewModel
      .find({ shopId, status: 'APPROVED' })
      .populate('productId', 'name slug mainImage')
      .populate('customerId', 'firstName lastName')
      .sort({ createdAt: -1 });
  }

  /**
   * Répondre à un avis (SELLER)
   */
  async respondToReview(
    reviewId: string,
    sellerId: string,
    respondDto: RespondToReviewDto,
  ) {
    const review = await this.reviewModel.findById(reviewId).populate('shopId');

    if (!review) {
      throw new NotFoundException('Avis introuvable');
    }

    const shop = review.shopId as any;

    if (shop.sellerId.toString() !== sellerId) {
      throw new BadRequestException('Vous ne pouvez répondre qu\'aux avis de votre boutique');
    }

    review.sellerResponse = {
      sellerId,
      comment: respondDto.comment,
      respondedAt: new Date(),
    };

    await review.save();

    return review;
  }

  /**
   * Approuver/rejeter un avis (ADMIN)
   */
  async moderateReview(reviewId: string, adminId: string, status: string, reason?: string) {
    const review = await this.reviewModel.findById(reviewId);

    if (!review) {
      throw new NotFoundException('Avis introuvable');
    }

    review.status = status as any;
    review.moderatedBy = adminId;
    review.moderatedAt = new Date();
    review.moderationReason = reason;

    await review.save();

    // Mettre à jour les stats si l'avis est approuvé/rejeté
    await this.updateProductStats(review.productId.toString());
    await this.updateShopStats(review.shopId.toString());

    return review;
  }

  /**
   * Mettre à jour les statistiques d'un produit
   */
  private async updateProductStats(productId: string) {
    const reviews = await this.reviewModel.find({
      productId,
      status: 'APPROVED',
    });

    const reviewsCount = reviews.length;
    const averageRating =
      reviewsCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
        : 0;

    await this.productModel.findByIdAndUpdate(productId, {
      reviewsCount,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  }

  /**
   * Mettre à jour les statistiques d'une boutique
   */
  private async updateShopStats(shopId: string) {
    const reviews = await this.reviewModel.find({
      shopId,
      status: 'APPROVED',
    });

    const reviewsCount = reviews.length;
    const averageRating =
      reviewsCount > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
        : 0;

    await this.shopModel.findByIdAndUpdate(shopId, {
      totalReviews: reviewsCount,
      averageRating: Math.round(averageRating * 10) / 10,
    });
  }

  /**
   * Récupérer tous les avis (ADMIN)
   */
  async findAll(filters?: { status?: string; shopId?: string }) {
    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.shopId) {
      query.shopId = filters.shopId;
    }

    return this.reviewModel
      .find(query)
      .populate('productId', 'name slug')
      .populate('shopId', 'name slug')
      .populate('customerId', 'firstName lastName email')
      .sort({ createdAt: -1 });
  }
}
