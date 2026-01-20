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
exports.ProductSchema = exports.Product = exports.ProductStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "DRAFT";
    ProductStatus["ACTIVE"] = "ACTIVE";
    ProductStatus["OUT_OF_STOCK"] = "OUT_OF_STOCK";
    ProductStatus["ARCHIVED"] = "ARCHIVED";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Shop', required: true }),
    __metadata("design:type", String)
], Product.prototype, "shopId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true }),
    __metadata("design:type", String)
], Product.prototype, "sellerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "shortDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ProductStatus, default: ProductStatus.DRAFT }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ min: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "compareAtPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, min: 0, max: 100 }),
    __metadata("design:type", Number)
], Product.prototype, "discountPercent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "mainImage", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            weight: Number,
            length: Number,
            width: Number,
            height: Number,
        },
    }),
    __metadata("design:type", Object)
], Product.prototype, "dimensions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "hasVariants", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "metaTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "metaDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "viewsCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "salesCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "reviewsCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Product.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "isApproved", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "approvalNote", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
exports.ProductSchema.index({ shopId: 1, status: 1 });
exports.ProductSchema.index({ sellerId: 1 });
exports.ProductSchema.index({ slug: 1 });
exports.ProductSchema.index({ category: 1, status: 1 });
exports.ProductSchema.index({ tags: 1 });
exports.ProductSchema.index({ isFeatured: -1, createdAt: -1 });
exports.ProductSchema.index({ averageRating: -1, reviewsCount: -1 });
exports.ProductSchema.index({ price: 1 });
exports.ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
//# sourceMappingURL=product.schema.js.map