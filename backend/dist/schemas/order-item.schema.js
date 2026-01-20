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
exports.OrderItemSchema = exports.OrderItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let OrderItem = class OrderItem {
};
exports.OrderItem = OrderItem;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Order', required: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Shop', required: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "shopId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "sellerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Product', required: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'ProductVariant' }),
    __metadata("design:type", String)
], OrderItem.prototype, "variantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            name: { type: String, required: true },
            slug: String,
            image: String,
            sku: String,
            variantName: String,
        },
        required: true,
    }),
    __metadata("design:type", Object)
], OrderItem.prototype, "productSnapshot", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OrderItem.prototype, "unitPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], OrderItem.prototype, "totalPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 20 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "platformCommissionRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "platformCommissionAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "sellerPayout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "shippingCost", void 0);
exports.OrderItem = OrderItem = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], OrderItem);
exports.OrderItemSchema = mongoose_1.SchemaFactory.createForClass(OrderItem);
exports.OrderItemSchema.index({ orderId: 1 });
exports.OrderItemSchema.index({ shopId: 1, orderId: 1 });
exports.OrderItemSchema.index({ sellerId: 1, createdAt: -1 });
exports.OrderItemSchema.index({ productId: 1 });
exports.OrderItemSchema.pre('save', function (next) {
    this.totalPrice = this.quantity * this.unitPrice;
    this.platformCommissionAmount =
        (this.totalPrice * this.platformCommissionRate) / 100;
    this.sellerPayout = this.totalPrice - this.platformCommissionAmount;
    next();
});
//# sourceMappingURL=order-item.schema.js.map