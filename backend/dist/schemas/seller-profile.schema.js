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
exports.SellerProfileSchema = exports.SellerProfile = exports.SellerStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var SellerStatus;
(function (SellerStatus) {
    SellerStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    SellerStatus["APPROVED"] = "APPROVED";
    SellerStatus["REJECTED"] = "REJECTED";
    SellerStatus["SUSPENDED"] = "SUSPENDED";
})(SellerStatus || (exports.SellerStatus = SellerStatus = {}));
let SellerProfile = class SellerProfile {
};
exports.SellerProfile = SellerProfile;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true, unique: true }),
    __metadata("design:type", String)
], SellerProfile.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SellerProfile.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SellerProfile.prototype, "businessDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: SellerStatus, default: SellerStatus.PENDING_APPROVAL }),
    __metadata("design:type", String)
], SellerProfile.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SellerProfile.prototype, "siret", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SellerProfile.prototype, "tvaNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SellerProfile.prototype, "legalForm", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true, default: 'France' },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], SellerProfile.prototype, "businessAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SellerProfile.prototype, "businessEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SellerProfile.prototype, "businessPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SellerProfile.prototype, "stripeConnectId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], SellerProfile.prototype, "stripeOnboardingComplete", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], SellerProfile.prototype, "documents", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 20, min: 0, max: 50 }),
    __metadata("design:type", Number)
], SellerProfile.prototype, "commissionRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SellerProfile.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], SellerProfile.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SellerProfile.prototype, "rejectionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SellerProfile.prototype, "totalSales", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SellerProfile.prototype, "totalOrders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SellerProfile.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SellerProfile.prototype, "totalReviews", void 0);
exports.SellerProfile = SellerProfile = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SellerProfile);
exports.SellerProfileSchema = mongoose_1.SchemaFactory.createForClass(SellerProfile);
exports.SellerProfileSchema.index({ userId: 1 });
exports.SellerProfileSchema.index({ status: 1 });
exports.SellerProfileSchema.index({ stripeConnectId: 1 });
exports.SellerProfileSchema.index({ createdAt: -1 });
//# sourceMappingURL=seller-profile.schema.js.map