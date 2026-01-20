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
exports.ProductVariantSchema = exports.ProductVariant = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ProductVariant = class ProductVariant {
};
exports.ProductVariant = ProductVariant;
__decorate([
    (0, mongoose_1.Prop)({ type: 'ObjectId', ref: 'Product', required: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                name: String,
                value: String,
            },
        ],
        required: true,
    }),
    __metadata("design:type", Array)
], ProductVariant.prototype, "options", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ProductVariant.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ProductVariant.prototype, "compareAtPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "stock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], ProductVariant.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ProductVariant.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ProductVariant.prototype, "weight", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ProductVariant.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ProductVariant.prototype, "salesCount", void 0);
exports.ProductVariant = ProductVariant = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ProductVariant);
exports.ProductVariantSchema = mongoose_1.SchemaFactory.createForClass(ProductVariant);
exports.ProductVariantSchema.index({ productId: 1, isActive: 1 });
exports.ProductVariantSchema.index({ sku: 1 });
exports.ProductVariantSchema.index({ stock: 1 });
//# sourceMappingURL=product-variant.schema.js.map