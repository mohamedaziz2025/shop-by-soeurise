import { ReviewsService } from './reviews.service';
import { CreateReviewDto, RespondToReviewDto } from './dto/review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getProductReviews(productId: string, filters: {
        status?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getShopReviews(shopId: string): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createReview(user: any, createReviewDto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    respondToReview(id: string, user: any, respondDto: RespondToReviewDto): Promise<import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getAllReviews(filters: {
        status?: string;
        shopId?: string;
    }): Promise<(import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    moderateReview(id: string, user: any, body: {
        status: string;
        reason?: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("../schemas/review.schema").ReviewDocument, {}, {}> & import("../schemas/review.schema").Review & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
