const express = require('express');
const auth = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

const router = express.Router();

/**
 * Optional auth middleware - allows both authenticated and guest users
 */
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
      const jwt = require('jsonwebtoken');
      const User = require('../models/User');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.userId);
      if (user && user.status === 'ACTIVE') {
        req.user = user;
      }
    }
  } catch (error) {
    // Silent fail - guest users don't have tokens
  }
  next();
};

/**
 * Utility function to calculate cart totals with items grouped by shop
 */
async function calculateCartTotals(cart) {
  const itemsByShop = new Map();

  // Group items by shop and calculate subtotals
  for (const item of cart.items) {
    const shopId = item.shopId.toString();

    if (!itemsByShop.has(shopId)) {
      const shop = await Shop.findById(item.shopId).select('name slug shippingPrice shippingConfig');
      itemsByShop.set(shopId, {
        shopId,
        shop: shop ? {
          _id: shop._id,
          name: shop.name,
          slug: shop.slug,
          shippingPrice: shop.shippingPrice || 0,
          shippingConfig: shop.shippingConfig,
        } : null,
        items: [],
        subtotal: 0,
        shipping: 0,
        total: 0,
      });
    }

    const shopCart = itemsByShop.get(shopId);
    const itemTotal = item.price * item.quantity;

    shopCart.items.push({
      product: item.productId,
      variant: item.variantId,
      quantity: item.quantity,
      price: item.price,
      subtotal: itemTotal,
      productSnapshot: item.productSnapshot,
    });

    shopCart.subtotal += itemTotal;
  }

  // Calculate shipping for each shop
  const shopCarts = Array.from(itemsByShop.values());

  for (const shopCart of shopCarts) {
    const shop = shopCart.shop;
    const shippingPrice = shop?.shippingPrice || 0;
    const shippingConfig = shop?.shippingConfig;

    if (shippingConfig?.enabled) {
      // Free shipping if threshold reached
      if (
        shippingConfig.freeShippingThreshold &&
        shopCart.subtotal >= shippingConfig.freeShippingThreshold
      ) {
        shopCart.shipping = 0;
      } else {
        // Use shippingPrice field first, then fallback to flatRate from config
        shopCart.shipping = shippingPrice || shippingConfig.flatRate || 0;
      }

      // Apply maximum shipping cost if set
      if (
        shippingConfig.maxShippingCost &&
        shopCart.shipping > shippingConfig.maxShippingCost
      ) {
        shopCart.shipping = shippingConfig.maxShippingCost;
      }
    } else {
      // If shipping disabled, use configured price
      shopCart.shipping = shippingPrice;
    }

    shopCart.total = shopCart.subtotal + shopCart.shipping;
  }

  // Calculate global totals
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

// Get user's cart (works for both authenticated users and guests)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const guestId = req.query.guestId;

    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId required' });
    }

    const query = userId ? { userId } : { guestId };

    let cart = await Cart.findOne(query)
      .populate('items.productId', 'name price mainImage slug')
      .populate('items.shopId', 'name slug shippingPrice shippingConfig');

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = await Cart.create({ ...query, items: [] });
    }

    const cartData = await calculateCartTotals(cart);
    res.json(cartData);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

// Add item to cart (works for both authenticated users and guests)
router.post('/add', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { productId, variantId, quantity, guestId } = req.body;

    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId required' });
    }

    if (!productId || !quantity) {
      return res.status(400).json({ error: 'productId and quantity are required' });
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product || product.status !== 'ACTIVE') {
      return res.status(404).json({ error: 'Product not found or unavailable' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Get or create cart
    const query = userId ? { userId } : { guestId };
    let cart = await Cart.findOne(query);

    if (!cart) {
      cart = await Cart.create({ ...query, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (!variantId || (item.variantId && item.variantId.toString() === variantId))
    );

    if (existingItemIndex > -1) {
      // Update quantity if already exists
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        productId,
        variantId,
        shopId: product.shopId,
        quantity,
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

    // Repopulate and return updated cart
    await cart.populate('items.productId', 'name price mainImage slug');
    await cart.populate('items.shopId', 'name slug shippingPrice shippingConfig');

    const cartData = await calculateCartTotals(cart);
    res.status(200).json(cartData);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Update cart item quantity
router.put('/item/:productId', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const guestId = req.query.guestId;
    const { productId } = req.params;
    const variantId = req.query.variantId;
    const { quantity } = req.body;

    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId required' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.productId.toString() === productId &&
        (!variantId || (item.variantId && item.variantId.toString() === variantId))
    );

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    // Repopulate and return updated cart
    await cart.populate('items.productId', 'name price mainImage slug');
    await cart.populate('items.shopId', 'name slug shippingPrice shippingConfig');

    const cartData = await calculateCartTotals(cart);
    res.json(cartData);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item' });
  }
});

// Remove item from cart
router.delete('/item/:productId', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const guestId = req.query.guestId;
    const { productId } = req.params;
    const variantId = req.query.variantId;

    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId required' });
    }

    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOne(query);

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Filter out the item to remove
    cart.items = cart.items.filter(
      (item) =>
        !(
          item.productId.toString() === productId &&
          (!variantId || (item.variantId && item.variantId.toString() === variantId))
        )
    );

    await cart.save();

    // Repopulate and return updated cart
    await cart.populate('items.productId', 'name price mainImage slug');
    await cart.populate('items.shopId', 'name slug shippingPrice shippingConfig');

    const cartData = await calculateCartTotals(cart);
    res.json(cartData);
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart
router.delete('/clear', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const guestId = req.query.guestId;

    if (!userId && !guestId) {
      return res.status(400).json({ error: 'userId or guestId required' });
    }

    const query = userId ? { userId } : { guestId };
    const cart = await Cart.findOne(query);

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

// Merge guest cart into user cart after authentication
router.post('/merge', auth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { guestId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User not authenticated' });
    }

    if (!guestId) {
      // No guest cart to merge, return user's cart
      let userCart = await Cart.findOne({ userId });
      if (!userCart) {
        userCart = await Cart.create({ userId, items: [] });
      }
      const cartData = await calculateCartTotals(userCart);
      return res.json(cartData);
    }

    // Find guest cart
    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart) {
      // No guest cart, return user's cart
      let userCart = await Cart.findOne({ userId });
      if (!userCart) {
        userCart = await Cart.create({ userId, items: [] });
      }
      const cartData = await calculateCartTotals(userCart);
      return res.json(cartData);
    }

    // Find or create user cart
    let userCart = await Cart.findOne({ userId });
    if (!userCart) {
      userCart = await Cart.create({ userId, items: [] });
    }

    // Merge items: sum quantities for same product/variant
    for (const guestItem of guestCart.items) {
      const existingIndex = userCart.items.findIndex(
        (item) =>
          item.productId.toString() === guestItem.productId.toString() &&
          ((item.variantId && guestItem.variantId && item.variantId.toString() === guestItem.variantId.toString()) ||
            (!item.variantId && !guestItem.variantId))
      );

      if (existingIndex > -1) {
        userCart.items[existingIndex].quantity += guestItem.quantity;
      } else {
        userCart.items.push({
          productId: guestItem.productId,
          variantId: guestItem.variantId,
          shopId: guestItem.shopId,
          quantity: guestItem.quantity,
          price: guestItem.price,
          productSnapshot: guestItem.productSnapshot,
          addedAt: guestItem.addedAt,
        });
      }
    }

    await userCart.save();

    // Delete guest cart
    await Cart.deleteOne({ guestId });

    // Repopulate and return merged cart
    await userCart.populate('items.productId', 'name price mainImage slug');
    await userCart.populate('items.shopId', 'name slug shippingPrice shippingConfig');

    const cartData = await calculateCartTotals(userCart);
    res.json(cartData);
  } catch (error) {
    console.error('Error merging carts:', error);
    res.status(500).json({ error: 'Failed to merge carts' });
  }
});

module.exports = router;