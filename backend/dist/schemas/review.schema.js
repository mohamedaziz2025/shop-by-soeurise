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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSchema = exports.Review = exports.ReviewStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "PENDING";
    ReviewStatus["APPROVED"] = "APPROVED";
    ReviewStatus["REJECTED"] = "REJECTED";
})(ReviewStatus || (exports.ReviewStatus = ReviewStatus = {}));
let Review = class Review {
};
exports.Review = Review;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Product', required: true }),
    __metadata("design:type", String)
], Review.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Shop', required: true }),
    __metadata("design:type", String)
], Review.prototype, "shopId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Order', required: true }),
    __metadata("design:type", String)
], Review.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true }),
    __metadata("design:type", String)
], Review.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 5 }),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Review.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Review.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ReviewStatus, default: ReviewStatus.PENDING }),
    __metadata("design:type", String)
], Review.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Review.prototype, "isVerifiedPurchase", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Review.prototype, "helpfulCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Review.prototype, "notHelpfulCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            sellerId: { type: 'ObjectId', ref: 'User' },
            comment: String,
            respondedAt: Date,
        },
    }),
    __metadata("design:type", Object)
], Review.prototype, "sellerResponse", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Review.prototype, "moderatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Review.prototype, "moderatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Review.prototype, "moderationReason", void 0);
exports.Review = Review = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Review);
exports.ReviewSchema = mongoose_1.SchemaFactory.createForClass(Review);
exports.ReviewSchema.index({ productId: 1, status: 1, createdAt: -1 });
exports.ReviewSchema.index({ shopId: 1, status: 1 });
exports.ReviewSchema.index({ customerId: 1, createdAt: -1 });
exports.ReviewSchema.index({ orderId: 1 });
exports.ReviewSchema.index({ status: 1, createdAt: -1 });
exports.ReviewSchema.index({ rating: -1, helpfulCount: -1 });
exports.ReviewSchema.index({ customerId: 1, productId: 1, orderId: 1 }, { unique: true });
//# sourceMappingURL=review.schema.js.map