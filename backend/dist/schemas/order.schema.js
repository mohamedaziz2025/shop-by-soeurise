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
exports.OrderSchema = exports.Order = exports.PaymentStatus = exports.OrderStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING_PAYMENT"] = "PENDING_PAYMENT";
    OrderStatus["PAID"] = "PAID";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["REFUNDED"] = "REFUNDED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let Order = class Order {
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true }),
    __metadata("design:type", String)
], Order.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: OrderStatus, default: OrderStatus.PENDING_PAYMENT }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            additionalInfo: String,
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Order.prototype, "shippingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            firstName: String,
            lastName: String,
            street: String,
            city: String,
            postalCode: String,
            country: String,
        },
    }),
    __metadata("design:type", Object)
], Order.prototype, "billingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "shippingTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "discountTotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Order.prototype, "stripePaymentIntentId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Order.prototype, "stripeChargeId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Payment' }),
    __metadata("design:type", String)
], Order.prototype, "paymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Order.prototype, "customerNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Order.prototype, "adminNote", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Order.prototype, "cancelledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Order.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Order' }),
    __metadata("design:type", String)
], Order.prototype, "parentOrderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "isSubOrder", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
exports.OrderSchema.index({ orderNumber: 1 });
exports.OrderSchema.index({ customerId: 1, createdAt: -1 });
exports.OrderSchema.index({ status: 1 });
exports.OrderSchema.index({ paymentStatus: 1 });
exports.OrderSchema.index({ parentOrderId: 1 });
exports.OrderSchema.index({ stripePaymentIntentId: 1 });
exports.OrderSchema.index({ createdAt: -1 });
exports.OrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const year = new Date().getFullYear();
        const random = Math.floor(100000 + Math.random() * 900000);
        this.orderNumber = `ORD-${year}-${random}`;
    }
    next();
});
//# sourceMappingURL=order.schema.js.map