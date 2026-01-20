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
exports.ShopSchema = exports.Shop = exports.ShopStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var ShopStatus;
(function (ShopStatus) {
    ShopStatus["ACTIVE"] = "ACTIVE";
    ShopStatus["INACTIVE"] = "INACTIVE";
    ShopStatus["SUSPENDED"] = "SUSPENDED";
})(ShopStatus || (exports.ShopStatus = ShopStatus = {}));
let Shop = class Shop {
};
exports.Shop = Shop;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true }),
    __metadata("design:type", String)
], Shop.prototype, "sellerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Shop.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true, lowercase: true }),
    __metadata("design:type", String)
], Shop.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Shop.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shop.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shop.prototype, "banner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ShopStatus, default: ShopStatus.ACTIVE }),
    __metadata("design:type", String)
], Shop.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Shop.prototype, "categories", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            enabled: { type: Boolean, default: true },
            flatRate: { type: Number },
            freeShippingThreshold: { type: Number },
            maxShippingCost: { type: Number },
            estimatedDays: { type: Number, default: 3 },
            shippingZones: [String],
        },
        default: {},
    }),
    __metadata("design:type", Object)
], Shop.prototype, "shippingConfig", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shop.prototype, "returnPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shop.prototype, "privacyPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            instagram: String,
            facebook: String,
            website: String,
        },
    }),
    __metadata("design:type", Object)
], Shop.prototype, "socialMedia", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shop.prototype, "totalProducts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shop.prototype, "totalSales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shop.prototype, "totalOrders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shop.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Shop.prototype, "totalReviews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Shop.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Shop.prototype, "isCompliant", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shop.prototype, "nonComplianceReason", void 0);
exports.Shop = Shop = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Shop);
exports.ShopSchema = mongoose_1.SchemaFactory.createForClass(Shop);
exports.ShopSchema.index({ sellerId: 1 });
exports.ShopSchema.index({ slug: 1 });
exports.ShopSchema.index({ status: 1 });
exports.ShopSchema.index({ isFeatured: -1, averageRating: -1 });
exports.ShopSchema.index({ categories: 1 });
exports.ShopSchema.index({ createdAt: -1 });
//# sourceMappingURL=shop.schema.js.map