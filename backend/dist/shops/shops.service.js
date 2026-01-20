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
exports.ShopsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const slugify_1 = require("slugify");
const shop_schema_1 = require("../schemas/shop.schema");
const user_schema_1 = require("../schemas/user.schema");
let ShopsService = class ShopsService {
    constructor(shopModel, userModel) {
        this.shopModel = shopModel;
        this.userModel = userModel;
    }
    async create(sellerId, createShopDto) {
        const user = await this.userModel.findById(sellerId);
        if (!user) {
            throw new common_1.NotFoundException('Utilisateur introuvable');
        }
        if (user.role !== user_schema_1.UserRole.SELLER) {
            throw new common_1.ForbiddenException('Seuls les vendeurs peuvent créer une boutique');
        }
        const existingShop = await this.shopModel.findOne({ sellerId });
        if (existingShop) {
            throw new common_1.BadRequestException('Vous avez déjà une boutique');
        }
        const slug = (0, slugify_1.default)(createShopDto.name, { lower: true, strict: true });
        const existingSlug = await this.shopModel.findOne({ slug });
        if (existingSlug) {
            throw new common_1.BadRequestException('Ce nom de boutique est déjà utilisé');
        }
        const shop = new this.shopModel({
            ...createShopDto,
            sellerId,
            slug,
        });
        await shop.save();
        return shop;
    }
    async findAll(filters) {
        const query = {};
        if (filters?.status) {
            query.status = filters.status;
        }
        if (filters?.category) {
            query.categories = filters.category;
        }
        if (filters?.isFeatured !== undefined) {
            query.isFeatured = filters.isFeatured;
        }
        return this.shopModel
            .find(query)
            .populate('sellerId', 'firstName lastName email')
            .sort({ isFeatured: -1, averageRating: -1, createdAt: -1 });
    }
    async findBySlug(slug) {
        const shop = await this.shopModel
            .findOne({ slug, status: 'ACTIVE' })
            .populate('sellerId', 'firstName lastName email');
        if (!shop) {
            throw new common_1.NotFoundException('Boutique introuvable');
        }
        return shop;
    }
    async findById(id) {
        const shop = await this.shopModel
            .findById(id)
            .populate('sellerId', 'firstName lastName email');
        if (!shop) {
            throw new common_1.NotFoundException('Boutique introuvable');
        }
        return shop;
    }
    async findBySellerId(sellerId) {
        const shop = await this.shopModel.findOne({ sellerId });
        if (!shop) {
            throw new common_1.NotFoundException('Boutique introuvable');
        }
        return shop;
    }
    async update(sellerId, updateShopDto) {
        const shop = await this.shopModel.findOne({ sellerId });
        if (!shop) {
            throw new common_1.NotFoundException('Boutique introuvable');
        }
        if (updateShopDto.name && updateShopDto.name !== shop.name) {
            const newSlug = (0, slugify_1.default)(updateShopDto.name, { lower: true, strict: true });
            const existingSlug = await this.shopModel.findOne({
                slug: newSlug,
                _id: { $ne: shop._id },
            });
            if (existingSlug) {
                throw new common_1.BadRequestException('Ce nom de boutique est déjà utilisé');
            }
            shop.slug = newSlug;
        }
        Object.assign(shop, updateShopDto);
        await shop.save();
        return shop;
    }
    async delete(sellerId) {
        const shop = await this.shopModel.findOne({ sellerId });
        if (!shop) {
            throw new common_1.NotFoundException('Boutique introuvable');
        }
        shop.status = shop_schema_1.ShopStatus.INACTIVE;
        await shop.save();
        return { message: 'Boutique archivée avec succès' };
    }
    async updateStatus(shopId, status) {
        const shop = await this.shopModel.findByIdAndUpdate(shopId, { status }, { new: true });
        if (!shop) {
            throw new common_1.NotFoundException('Boutique introuvable');
        }
        return shop;
    }
    async toggleFeatured(shopId) {
        const shop = await this.shopModel.findById(shopId);
        if (!shop) {
            throw new common_1.NotFoundException('Boutique introuvable');
        }
        shop.isFeatured = !shop.isFeatured;
        await shop.save();
        return shop;
    }
    async setCompliance(shopId, isCompliant, reason) {
        const shop = await this.shopModel.findByIdAndUpdate(shopId, {
            isCompliant,
            nonComplianceReason: isCompliant ? undefined : reason,
        }, { new: true });
        if (!shop) {
            throw new common_1.NotFoundException('Boutique introuvable');
        }
        return shop;
    }
};
exports.ShopsService = ShopsService;
exports.ShopsService = ShopsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shop_schema_1.Shop.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ShopsService);
//# sourceMappingURL=shops.service.js.map