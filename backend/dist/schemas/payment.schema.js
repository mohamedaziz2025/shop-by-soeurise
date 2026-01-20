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
exports.PaymentSchema = exports.Payment = exports.PaymentStatus = exports.PaymentMethod = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CARD"] = "CARD";
    PaymentMethod["SEPA"] = "SEPA";
    PaymentMethod["OTHER"] = "OTHER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PROCESSING"] = "PROCESSING";
    PaymentStatus["SUCCEEDED"] = "SUCCEEDED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
    PaymentStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Payment = class Payment {
};
exports.Payment = Payment;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Order', required: true }),
    __metadata("design:type", String)
], Payment.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true }),
    __metadata("design:type", String)
], Payment.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING }),
    __metadata("design:type", String)
], Payment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Payment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'EUR' }),
    __metadata("design:type", String)
], Payment.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PaymentMethod, required: true }),
    __metadata("design:type", String)
], Payment.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Payment.prototype, "stripePaymentIntentId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "stripeChargeId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "stripePaymentMethodId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                shopId: { type: 'ObjectId', ref: 'Shop' },
                sellerId: { type: 'ObjectId', ref: 'User' },
                amount: Number,
                platformCommission: Number,
                sellerPayout: Number,
                stripeTransferId: String,
                status: { type: String, default: 'PENDING' },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Payment.prototype, "splits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payment.prototype, "totalPlatformCommission", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Payment.prototype, "refundedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            amount: Number,
            reason: String,
            stripeRefundId: String,
            refundedAt: Date,
        },
    ]),
    __metadata("design:type", Array)
], Payment.prototype, "refunds", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "customerEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "customerName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payment.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Payment.prototype, "failedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Payment.prototype, "failureReason", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Payment.prototype, "webhookEvents", void 0);
exports.Payment = Payment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Payment);
exports.PaymentSchema = mongoose_1.SchemaFactory.createForClass(Payment);
exports.PaymentSchema.index({ orderId: 1 });
exports.PaymentSchema.index({ customerId: 1, createdAt: -1 });
exports.PaymentSchema.index({ stripePaymentIntentId: 1 });
exports.PaymentSchema.index({ status: 1 });
exports.PaymentSchema.index({ 'splits.shopId': 1 });
exports.PaymentSchema.index({ 'splits.sellerId': 1 });
exports.PaymentSchema.index({ createdAt: -1 });
//# sourceMappingURL=payment.schema.js.map