export declare class CreateReviewDto {
    productId: string;
    orderId: string;
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
}
export declare class RespondToReviewDto {
    comment: string;
}
