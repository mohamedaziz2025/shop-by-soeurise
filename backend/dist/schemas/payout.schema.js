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
exports.PayoutSchema = exports.Payout = exports.PayoutStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var PayoutStatus;
(function (PayoutStatus) {
    PayoutStatus["PENDING"] = "PENDING";
    PayoutStatus["PROCESSING"] = "PROCESSING";
    PayoutStatus["PAID"] = "PAID";
    PayoutStatus["FAILED"] = "FAILED";
    PayoutStatus["CANCELLED"] = "CANCELLED";
})(PayoutStatus || (exports.PayoutStatus = PayoutStatus = {}));
let Payout = class Payout {
};
exports.Payout = Payout;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true }),
    __metadata("design:type", String)
], Payout.prototype, "sellerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Shop', required: true }),
    __metadata("design:type", String)
], Payout.prototype, "shopId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PayoutStatus, default: PayoutStatus.PENDING }),
    __metadata("design:type", String)
], Payout.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Payout.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'EUR' }),
    __metadata("design:type", String)
], Payout.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Payout.prototype, "stripeConnectAccountId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payout.prototype, "stripeTransferId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payout.prototype, "stripePayoutId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Payout.prototype, "periodStart", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Payout.prototype, "periodEnd", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            totalSales: { type: Number, default: 0 },
            totalOrders: { type: Number, default: 0 },
            platformCommission: { type: Number, default: 0 },
            shippingReimbursement: { type: Number, default: 0 },
            adjustments: { type: Number, default: 0 },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Payout.prototype, "breakdown", void 0);
__decorate([
    (0, mongoose_1.Prop)([{ type: 'ObjectId', ref: 'Order' }]),
    __metadata("design:type", Array)
], Payout.prototype, "orderIds", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payout.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payout.prototype, "failedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payout.prototype, "failureReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'STRIPE_CONNECT' }),
    __metadata("design:type", String)
], Payout.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payout.prototype, "adminNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payout.prototype, "sellerNote", void 0);
exports.Payout = Payout = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Payout);
exports.PayoutSchema = mongoose_1.SchemaFactory.createForClass(Payout);
exports.PayoutSchema.index({ sellerId: 1, createdAt: -1 });
exports.PayoutSchema.index({ shopId: 1, status: 1 });
exports.PayoutSchema.index({ status: 1, createdAt: -1 });
exports.PayoutSchema.index({ stripeConnectAccountId: 1 });
exports.PayoutSchema.index({ periodStart: 1, periodEnd: 1 });
exports.PayoutSchema.index({ createdAt: -1 });
//# sourceMappingURL=payout.schema.js.map