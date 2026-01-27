import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from '../schemas/cart.schema';
import { Product, ProductDocument } from '../schemas/product.schema';
import { ProductVariant, ProductVariantDocument } from '../schemas/product-variant.schema';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(ProductVariant.name) private variantModel: Model<ProductVariantDocument>,
  ) {}

  /**
   * Récupérer le panier d'un utilisateur
   */
  async getCart(userId?: string, guestId?: string) {
    const query: any = {};
    if (userId) query.userId = userId;
    else if (guestId) query.guestId = guestId;
    else throw new BadRequestException('userId or guestId required');

    let cart = await this.cartModel
      .findOne(query)
      .populate('items.productId', 'name price mainImage slug')
      .populate('items.shopId', 'name slug shippingConfig');

    if (!cart) {
      cart = await this.cartModel.create({ ...query, items: [] });
    }

    return this.calculateCartTotals(cart);
  }

  /**
   * Ajouter un produit au panier
   */
  async addToCart(userId: string | undefined, guestId: string | undefined, addToCartDto: AddToCartDto) {
    // Vérifier que le produit existe
    const product = await this.productModel.findById(addToCartDto.productId);

    if (!product || product.status !== 'ACTIVE') {
      throw new NotFoundException('Produit introuvable ou non disponible');
    }

    // Si variante, vérifier qu'elle existe et est active
    if (addToCartDto.variantId) {
      const variant = await this.variantModel.findById(addToCartDto.variantId);

      if (!variant || !variant.isActive || variant.stock < addToCartDto.quantity) {
        throw new BadRequestException('Variante non disponible ou stock insuffisant');
      }
    } else {
      // Vérifier le stock du produit principal
      if (product.stock < addToCartDto.quantity) {
        throw new BadRequestException('Stock insuffisant');
      }
    }

    // Récupérer ou créer le panier
    const query: any = {};
    if (userId) query.userId = userId;
    else if (guestId) query.guestId = guestId;
    else throw new BadRequestException('userId or guestId required');

    let cart = await this.cartModel.findOne(query);

    if (!cart) {
      cart = await this.cartModel.create({ ...query, items: [] });
    }

    // Vérifier si le produit (ou variante) est déjà dans le panier
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === addToCartDto.productId &&
        (!addToCartDto.variantId ||
          item.variantId?.toString() === addToCartDto.variantId),
    );

    if (existingItemIndex > -1) {
      // Mettre à jour la quantité
      cart.items[existingItemIndex].quantity += addToCartDto.quantity;
    } else {
      // Ajouter un nouvel item
      cart.items.push({
        productId: addToCartDto.productId,
        variantId: addToCartDto.variantId,
        shopId: product.shopId as any,
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

    return this.getCart(userId, guestId);
  }

  /**
   * Mettre à jour la quantité d'un item
   */
  async updateCartItem(
    userId: string | undefined,
    guestId: string | undefined,
    productId: string,
    variantId: string | undefined,
    updateDto: UpdateCartItemDto,
  ) {
    const query: any = {};
    if (userId) query.userId = userId;
    else if (guestId) query.guestId = guestId;
    else throw new BadRequestException('userId or guestId required');

    const cart = await this.cartModel.findOne(query);

    if (!cart) {
      throw new NotFoundException('Panier introuvable');
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (!variantId || item.variantId?.toString() === variantId),
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Article introuvable dans le panier');
    }

    cart.items[itemIndex].quantity = updateDto.quantity;
    await cart.save();

    return this.getCart(userId, guestId);
  }

  /**
   * Supprimer un item du panier
   */
  async removeFromCart(userId: string | undefined, guestId: string | undefined, productId: string, variantId?: string) {
    const query: any = {};
    if (userId) query.userId = userId;
    else if (guestId) query.guestId = guestId;
    else throw new BadRequestException('userId or guestId required');

    const cart = await this.cartModel.findOne(query);

    if (!cart) {
      throw new NotFoundException('Panier introuvable');
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          (!variantId || item.variantId?.toString() === variantId)
        ),
    );

    await cart.save();

    return this.getCart(userId, guestId);
  }

  /**
   * Vider le panier
   */
  async clearCart(userId: string | undefined, guestId: string | undefined) {
    const query: any = {};
    if (userId) query.userId = userId;
    else if (guestId) query.guestId = guestId;
    else throw new BadRequestException('userId or guestId required');

    const cart = await this.cartModel.findOne(query);

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return { message: 'Panier vidé avec succès' };
  }

  /**
   * Merge a guest cart into a user's cart after authentication
   */
  async mergeGuestCart(userId: string, guestId: string) {
    if (!guestId) return this.getCart(userId);

    const guestCart = await this.cartModel.findOne({ guestId });
    if (!guestCart) return this.getCart(userId);

    let userCart = await this.cartModel.findOne({ userId });
    if (!userCart) {
      userCart = await this.cartModel.create({ userId, items: [] });
    }

    // Merge items: sum quantities for same product/variant
    for (const gItem of guestCart.items) {
      const existingIndex = userCart.items.findIndex(
        (item) =>
          item.productId.toString() === gItem.productId.toString() &&
          ((item.variantId && gItem.variantId && item.variantId.toString() === gItem.variantId.toString()) || (!item.variantId && !gItem.variantId)),
      );

      if (existingIndex > -1) {
        userCart.items[existingIndex].quantity += gItem.quantity;
      } else {
        userCart.items.push({
          productId: gItem.productId,
          variantId: gItem.variantId,
          shopId: gItem.shopId,
          quantity: gItem.quantity,
          price: gItem.price,
          productSnapshot: gItem.productSnapshot,
          addedAt: gItem.addedAt,
        } as any);
      }
    }

    await userCart.save();

    // Remove guest cart
    await this.cartModel.deleteOne({ guestId });

    return this.getCart(userId);
  }

  /**
   * Calculer les totaux et regrouper par boutique
   */
  private async calculateCartTotals(cart: CartDocument) {
    const itemsByShop = new Map();

    for (const item of cart.items) {
      const shopId = item.shopId.toString();

      if (!itemsByShop.has(shopId)) {
        itemsByShop.set(shopId, {
          shopId,
          shop: item.shopId, // Populated shop document
          items: [],
          subtotal: 0,
          shipping: 0,
          total: 0,
        });
      }

      const shopCart = itemsByShop.get(shopId);
      const itemTotal = item.price * item.quantity;

      // Transform item to include full product data
      shopCart.items.push({
        product: item.productId, // Populated product document
        variant: item.variantId,
        quantity: item.quantity,
        price: item.price,
        subtotal: itemTotal,
        productSnapshot: item.productSnapshot,
      });
      
      shopCart.subtotal += itemTotal;
    }

    // Calculer les frais de livraison pour chaque boutique
    const shopCarts = Array.from(itemsByShop.values());

    for (const shopCart of shopCarts) {
      const shop = shopCart.shop as any;
      const shippingPrice = shop.shippingPrice || 0;
      const shippingConfig = shop.shippingConfig;

      if (shippingConfig?.enabled) {
        // Livraison gratuite si seuil atteint
        if (
          shippingConfig.freeShippingThreshold &&
          shopCart.subtotal >= shippingConfig.freeShippingThreshold
        ) {
          shopCart.shipping = 0;
        } else {
          // Utiliser d'abord shippingPrice (nouveau champ obligatoire)
          // En fallback, utiliser flatRate de la config avancée
          shopCart.shipping = shippingPrice || shippingConfig.flatRate || 0;
        }

        // Appliquer le plafond si défini
        if (
          shippingConfig.maxShippingCost &&
          shopCart.shipping > shippingConfig.maxShippingCost
        ) {
          shopCart.shipping = shippingConfig.maxShippingCost;
        }
      } else {
        // Si livraison désactivée, utiliser le prix configuré
        shopCart.shipping = shippingPrice;
      }

      shopCart.total = shopCart.subtotal + shopCart.shipping;
    }

    // Calculer le total global
    const globalSubtotal = shopCarts.reduce((sum, sc) => sum + sc.subtotal, 0);
    const globalShipping = shopCarts.reduce((sum, sc) => sum + sc.shipping, 0);
    const globalTotal = globalSubtotal + globalShipping;

    return {
      items: cart.items,
      itemsByShop: shopCarts,
      totals: {
        subtotal: globalSubtotal,
        shipping: globalShipping,
        total: globalTotal,
        itemCount: cart.items.length,
        shopCount: shopCarts.length,
      },
    };
  }
}
