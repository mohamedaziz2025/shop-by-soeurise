"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("../schemas/review.schema");
const product_schema_1 = require("../schemas/product.schema");
const shop_schema_1 = require("../schemas/shop.schema");
const order_item_schema_1 = require("../schemas/order-item.schema");
let ReviewsService = class ReviewsService {
    constructor(reviewModel, productModel, shopModel, orderItemModel) {
        this.reviewModel = reviewModel;
        this.productModel = productModel;
        this.shopModel = shopModel;
        this.orderItemModel = orderItemModel;
    }
    async create(customerId, createReviewDto) {
        const orderItem = await this.orderItemModel.findOne({
            orderId: createReviewDto.orderId,
            productId: createReviewDto.productId,
        }).populate('orderId');
        if (!orderItem) {
            throw new common_1.BadRequestException('Vous n\'avez pas acheté ce produit');
        }
        const order = orderItem.orderId;
        if (order.customerId.toString() !== customerId) {
            throw new common_1.BadRequestException('Cette commande ne vous appartient pas');
        }
        const existingReview = await this.reviewModel.findOne({
            customerId,
            productId: createReviewDto.productId,
            orderId: createReviewDto.orderId,
        });
        if (existingReview) {
            throw new common_1.BadRequestException('Vous avez déjà laissé un avis pour ce produit');
        }
        const product = await this.productModel.findById(createReviewDto.productId);
        if (!product) {
            throw new common_1.NotFoundException('Produit introuvable');
        }
        const review = new this.reviewModel({
            ...createReviewDto,
            customerId,
            shopId: product.shopId,
            isVerifiedPurchase: true,
        });
        await review.save();
        await this.updateProductStats(product._id.toString());
        await this.updateShopStats(product.shopId.toString());
        return review;
    }
    async findByProductId(productId, filters) {
        const query = { productId };
        if (filters?.status) {
            query.status = filters.status;
        }
        else {
            query.status = 'APPROVED';
        }
        return this.reviewModel
            .find(query)
            .populate('customerId', 'firstName lastName')
            .sort({ createdAt: -1 });
    }
    async findByShopId(shopId) {
        return this.reviewModel
            .find({ shopId, status: 'APPROVED' })
            .populate('productId', 'name slug mainImage')
            .populate('customerId', 'firstName lastName')
            .sort({ createdAt: -1 });
    }
    async respondToReview(reviewId, sellerId, respondDto) {
        const review = await this.reviewModel.findById(reviewId).populate('shopId');
        if (!review) {
            throw new common_1.NotFoundException('Avis introuvable');
        }
        const shop = review.shopId;
        if (shop.sellerId.toString() !== sellerId) {
            throw new common_1.BadRequestException('Vous ne pouvez répondre qu\'aux avis de votre boutique');
        }
        review.sellerResponse = {
            sellerId,
            comment: respondDto.comment,
            respondedAt: new Date(),
        };
        await review.save();
        return review;
    }
    async moderateReview(reviewId, adminId, status, reason) {
        const review = await this.reviewModel.findById(reviewId);
        if (!review) {
            throw new common_1.NotFoundException('Avis introuvable');
        }
        review.status = status;
        review.moderatedBy = adminId;
        review.moderatedAt = new Date();
        review.moderationReason = reason;
        await review.save();
        await this.updateProductStats(review.productId.toString());
        await this.updateShopStats(review.shopId.toString());
        return review;
    }
    async updateProductStats(productId) {
        const reviews = await this.reviewModel.find({
            productId,
            status: 'APPROVED',
        });
        const reviewsCount = reviews.length;
        const averageRating = reviewsCount > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
            : 0;
        await this.productModel.findByIdAndUpdate(productId, {
            reviewsCount,
            averageRating: Math.round(averageRating * 10) / 10,
        });
    }
    async updateShopStats(shopId) {
        const reviews = await this.reviewModel.find({
            shopId,
            status: 'APPROVED',
        });
        const reviewsCount = reviews.length;
        const averageRating = reviewsCount > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount
            : 0;
        await this.shopModel.findByIdAndUpdate(shopId, {
            totalReviews: reviewsCount,
            averageRating: Math.round(averageRating * 10) / 10,
        });
    }
    async findAll(filters) {
        const query = {};
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
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(shop_schema_1.Shop.name)),
    __param(3, (0, mongoose_1.InjectModel)(order_item_schema_1.OrderItem.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map