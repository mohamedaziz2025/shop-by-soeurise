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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const slugify_1 = require("slugify");
const product_schema_1 = require("../schemas/product.schema");
const product_variant_schema_1 = require("../schemas/product-variant.schema");
const shop_schema_1 = require("../schemas/shop.schema");
let ProductsService = class ProductsService {
    constructor(productModel, variantModel, shopModel) {
        this.productModel = productModel;
        this.variantModel = variantModel;
        this.shopModel = shopModel;
    }
    async create(sellerId, createProductDto) {
        const shop = await this.shopModel.findOne({ sellerId });
        if (!shop) {
            throw new common_1.NotFoundException('Vous devez créer une boutique avant de créer des produits');
        }
        const slug = (0, slugify_1.default)(createProductDto.name, { lower: true, strict: true }) + '-' + Date.now();
        const product = new this.productModel({
            ...createProductDto,
            shopId: shop._id,
            sellerId,
            slug,
        });
        await product.save();
        await this.shopModel.findByIdAndUpdate(shop._id, {
            $inc: { totalProducts: 1 },
        });
        return product;
    }
    async findAll(filters) {
        const query = { status: product_schema_1.ProductStatus.ACTIVE };
        if (filters?.shopId) {
            query.shopId = filters.shopId;
        }
        if (filters?.category) {
            query.category = filters.category;
        }
        if (filters?.status) {
            query.status = filters.status;
        }
        if (filters?.search) {
            query.$text = { $search: filters.search };
        }
        if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
            query.price = {};
            if (filters.minPrice !== undefined)
                query.price.$gte = filters.minPrice;
            if (filters.maxPrice !== undefined)
                query.price.$lte = filters.maxPrice;
        }
        if (filters?.tags && filters.tags.length > 0) {
            query.tags = { $in: filters.tags };
        }
        if (filters?.isFeatured !== undefined) {
            query.isFeatured = filters.isFeatured;
        }
        return this.productModel
            .find(query)
            .populate('shopId', 'name slug logo')
            .sort({ isFeatured: -1, createdAt: -1 })
            .limit(100);
    }
    async findBySlug(slug) {
        const product = await this.productModel
            .findOne({ slug, status: product_schema_1.ProductStatus.ACTIVE })
            .populate('shopId', 'name slug logo averageRating totalReviews');
        if (!product) {
            throw new common_1.NotFoundException('Produit introuvable');
        }
        product.viewsCount += 1;
        await product.save();
        let variants = [];
        if (product.hasVariants) {
            variants = await this.variantModel.find({
                productId: product._id,
                isActive: true,
            });
        }
        return { product, variants };
    }
    async findById(id) {
        const product = await this.productModel
            .findById(id)
            .populate('shopId', 'name slug logo');
        if (!product) {
            throw new common_1.NotFoundException('Produit introuvable');
        }
        return product;
    }
    async findBySellerId(sellerId) {
        return this.productModel
            .find({ sellerId })
            .populate('shopId', 'name slug')
            .sort({ createdAt: -1 });
    }
    async update(productId, sellerId, updateProductDto) {
        const product = await this.productModel.findOne({ _id: productId, sellerId });
        if (!product) {
            throw new common_1.NotFoundException('Produit introuvable');
        }
        if (updateProductDto.name && updateProductDto.name !== product.name) {
            const newSlug = (0, slugify_1.default)(updateProductDto.name, { lower: true, strict: true }) + '-' + Date.now();
            product.slug = newSlug;
        }
        Object.assign(product, updateProductDto);
        await product.save();
        return product;
    }
    async delete(productId, sellerId) {
        const product = await this.productModel.findOne({ _id: productId, sellerId });
        if (!product) {
            throw new common_1.NotFoundException('Produit introuvable');
        }
        product.status = product_schema_1.ProductStatus.ARCHIVED;
        await product.save();
        await this.shopModel.findByIdAndUpdate(product.shopId, {
            $inc: { totalProducts: -1 },
        });
        return { message: 'Produit archivé avec succès' };
    }
    async createVariant(productId, sellerId, createVariantDto) {
        const product = await this.productModel.findOne({ _id: productId, sellerId });
        if (!product) {
            throw new common_1.NotFoundException('Produit introuvable');
        }
        if (!product.hasVariants) {
            throw new common_1.BadRequestException('Ce produit ne supporte pas les variantes');
        }
        const existingSku = await this.variantModel.findOne({ sku: createVariantDto.sku });
        if (existingSku) {
            throw new common_1.BadRequestException('Ce SKU est déjà utilisé');
        }
        const variant = new this.variantModel({
            ...createVariantDto,
            productId,
        });
        await variant.save();
        return variant;
    }
    async findVariantsByProductId(productId) {
        return this.variantModel.find({ productId });
    }
    async updateVariant(variantId, sellerId, updateVariantDto) {
        const variant = await this.variantModel.findById(variantId).populate('productId');
        if (!variant) {
            throw new common_1.NotFoundException('Variante introuvable');
        }
        const product = await this.productModel.findOne({
            _id: variant.productId,
            sellerId,
        });
        if (!product) {
            throw new common_1.ForbiddenException('Vous n\'avez pas accès à cette variante');
        }
        Object.assign(variant, updateVariantDto);
        await variant.save();
        return variant;
    }
    async deleteVariant(variantId, sellerId) {
        const variant = await this.variantModel.findById(variantId).populate('productId');
        if (!variant) {
            throw new common_1.NotFoundException('Variante introuvable');
        }
        const product = await this.productModel.findOne({
            _id: variant.productId,
            sellerId,
        });
        if (!product) {
            throw new common_1.ForbiddenException('Vous n\'avez pas accès à cette variante');
        }
        await variant.deleteOne();
        return { message: 'Variante supprimée avec succès' };
    }
    async approveProduct(productId, isApproved, note) {
        const product = await this.productModel.findByIdAndUpdate(productId, { isApproved, approvalNote: note }, { new: true });
        if (!product) {
            throw new common_1.NotFoundException('Produit introuvable');
        }
        return product;
    }
    async toggleFeatured(productId) {
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Produit introuvable');
        }
        product.isFeatured = !product.isFeatured;
        await product.save();
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_variant_schema_1.ProductVariant.name)),
    __param(2, (0, mongoose_1.InjectModel)(shop_schema_1.Shop.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map