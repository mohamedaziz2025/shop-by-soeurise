import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { ProductDocument } from '../schemas/product.schema';
import { ShopDocument } from '../schemas/shop.schema';
import { OrderItemDocument } from '../schemas/order-item.schema';
import { CreateReviewDto, RespondToReviewDto } from './dto/review.dto';
export declare class ReviewsService {
    private reviewModel;
    private productModel;
    private shopModel;
    private orderItemModel;
    constructor(reviewModel: Model<ReviewDocument>, productModel: Model<ProductDocument>, shopModel: Model<ShopDocument>, orderItemModel: Model<OrderItemDocument>);
    create(customerId: string, createReviewDto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findByProductId(productId: string, filters?: {
        status?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findByShopId(shopId: string): Promise<(import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    respondToReview(reviewId: string, sellerId: string, respondDto: RespondToReviewDto): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    moderateReview(reviewId: string, adminId: string, status: string, reason?: string): Promise<import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    private updateProductStats;
    private updateShopStats;
    findAll(filters?: {
        status?: string;
        shopId?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, ReviewDocument, {}, {}> & Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
