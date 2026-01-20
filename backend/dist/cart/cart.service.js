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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("../schemas/cart.schema");
const product_schema_1 = require("../schemas/product.schema");
const product_variant_schema_1 = require("../schemas/product-variant.schema");
let CartService = class CartService {
    constructor(cartModel, productModel, variantModel) {
        this.cartModel = cartModel;
        this.productModel = productModel;
        this.variantModel = variantModel;
    }
    async getCart(userId) {
        let cart = await this.cartModel
            .findOne({ userId })
            .populate('items.productId', 'name price mainImage slug')
            .populate('items.shopId', 'name slug shippingConfig');
        if (!cart) {
            cart = await this.cartModel.create({ userId, items: [] });
        }
        return this.calculateCartTotals(cart);
    }
    async addToCart(userId, addToCartDto) {
        const product = await this.productModel.findById(addToCartDto.productId);
        if (!product || product.status !== 'ACTIVE') {
            throw new common_1.NotFoundException('Produit introuvable ou non disponible');
        }
        if (addToCartDto.variantId) {
            const variant = await this.variantModel.findById(addToCartDto.variantId);
            if (!variant || !variant.isActive || variant.stock < addToCartDto.quantity) {
                throw new common_1.BadRequestException('Variante non disponible ou stock insuffisant');
            }
        }
        else {
            if (product.stock < addToCartDto.quantity) {
                throw new common_1.BadRequestException('Stock insuffisant');
            }
        }
        let cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            cart = await this.cartModel.create({ userId, items: [] });
        }
        const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === addToCartDto.productId &&
            (!addToCartDto.variantId ||
                item.variantId?.toString() === addToCartDto.variantId));
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += addToCartDto.quantity;
        }
        else {
            cart.items.push({
                productId: addToCartDto.productId,
                variantId: addToCartDto.variantId,
                shopId: product.shopId,
                quantity: addToCartDto.quantity,
                price: product.price,
                productSnapshot: {
                    name: product.name,
                    image: product.mainImage,
                    slug: product.slug,
                },
                addedAt: new Date(),
            });
        }
        await cart.save();
        return this.getCart(userId);
    }
    async updateCartItem(userId, productId, variantId, updateDto) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new common_1.NotFoundException('Panier introuvable');
        }
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId &&
            (!variantId || item.variantId?.toString() === variantId));
        if (itemIndex === -1) {
            throw new common_1.NotFoundException('Article introuvable dans le panier');
        }
        cart.items[itemIndex].quantity = updateDto.quantity;
        await cart.save();
        return this.getCart(userId);
    }
    async removeFromCart(userId, productId, variantId) {
        const cart = await this.cartModel.findOne({ userId });
        if (!cart) {
            throw new common_1.NotFoundException('Panier introuvable');
        }
        cart.items = cart.items.filter((item) => !(item.productId.toString() === productId &&
            (!variantId || item.variantId?.toString() === variantId)));
        await cart.save();
        return this.getCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.cartModel.findOne({ userId });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        return { message: 'Panier vidé avec succès' };
    }
    async calculateCartTotals(cart) {
        const itemsByShop = new Map();
        for (const item of cart.items) {
            const shopId = item.shopId.toString();
            if (!itemsByShop.has(shopId)) {
                itemsByShop.set(shopId, {
                    shopId,
                    shopInfo: item.shopId,
                    items: [],
                    subtotal: 0,
                    shippingCost: 0,
                    total: 0,
                });
            }
            const shopCart = itemsByShop.get(shopId);
            const itemTotal = item.price * item.quantity;
            shopCart.items.push(item);
            shopCart.subtotal += itemTotal;
        }
        const shopCarts = Array.from(itemsByShop.values());
        for (const shopCart of shopCarts) {
            const shippingConfig = shopCart.shopInfo.shippingConfig;
            if (shippingConfig?.enabled) {
                if (shippingConfig.freeShippingThreshold &&
                    shopCart.subtotal >= shippingConfig.freeShippingThreshold) {
                    shopCart.shippingCost = 0;
                }
                else if (shippingConfig.flatRate) {
                    shopCart.shippingCost = shippingConfig.flatRate;
                }
                if (shippingConfig.maxShippingCost &&
                    shopCart.shippingCost > shippingConfig.maxShippingCost) {
                    shopCart.shippingCost = shippingConfig.maxShippingCost;
                }
            }
            shopCart.total = shopCart.subtotal + shopCart.shippingCost;
        }
        const globalSubtotal = shopCarts.reduce((sum, sc) => sum + sc.subtotal, 0);
        const globalShipping = shopCarts.reduce((sum, sc) => sum + sc.shippingCost, 0);
        const globalTotal = globalSubtotal + globalShipping;
        return {
            items: cart.items,
            itemsByShop: shopCarts,
            totalItems: cart.items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: globalSubtotal,
            shippingTotal: globalShipping,
            total: globalTotal,
        };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_variant_schema_1.ProductVariant.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], CartService);
//# sourceMappingURL=cart.service.js.map