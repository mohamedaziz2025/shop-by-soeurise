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
exports.CartSchema = exports.Cart = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Cart = class Cart {
};
exports.Cart = Cart;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'User', required: true, unique: true }),
    __metadata("design:type", String)
], Cart.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                productId: { type: 'ObjectId', ref: 'Product', required: true },
                variantId: { type: 'ObjectId', ref: 'ProductVariant' },
                shopId: { type: 'ObjectId', ref: 'Shop', required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true },
                productSnapshot: {
                    name: String,
                    image: String,
                    slug: String,
                },
                addedAt: { type: Date, default: Date.now },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Cart.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Cart.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Cart.prototype, "totalItems", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Cart.prototype, "lastActivityAt", void 0);
exports.Cart = Cart = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Cart);
exports.CartSchema = mongoose_1.SchemaFactory.createForClass(Cart);
exports.CartSchema.index({ userId: 1 });
exports.CartSchema.index({ 'items.productId': 1 });
exports.CartSchema.index({ 'items.shopId': 1 });
exports.CartSchema.index({ lastActivityAt: 1 });
exports.CartSchema.pre('save', function (next) {
    this.lastActivityAt = new Date();
    next();
});
//# sourceMappingURL=cart.schema.js.map