const express = require('express');
const { body, validationResult } = require('express-validator');
const Shop = require('../models/Shop');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

// Get all shops (public)
router.get('/', async (req, res) => {
  try {
    const { status = 'ACTIVE', category, isFeatured, page = 1, limit = 10 } = req.query;

    const query = { status };
    if (category) query.categories = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    const shops = await Shop.find(query)
      .populate('sellerId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Shop.countDocuments(query);

    res.json({
      shops,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get shop by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id)
      .populate('sellerId', 'firstName lastName email');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get shop by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const shop = await Shop.findOne({ slug: req.params.slug })
      .populate('sellerId', 'firstName lastName email');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get partners (public)
router.get('/partners/list', async (req, res) => {
  try {
    const partners = await Shop.find({ isFeatured: true, status: 'ACTIVE' })
      .populate('sellerId', 'firstName lastName')
      .limit(10);

    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create shop (Authenticated users)
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }),
  body('description').isLength({ min: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ sellerId: req.user._id });
    if (existingShop) {
      return res.status(400).json({ message: 'User already has a shop' });
    }

    const shopData = {
      ...req.body,
      sellerId: req.user._id,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    const shop = new Shop(shopData);
    await shop.save();

    res.status(201).json(shop);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Shop slug already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Get my shop (Authenticated users)
router.get('/seller/my-shop', auth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ sellerId: req.user._id });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update my shop (Authenticated users, own shop)
router.put('/seller/my-shop', auth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ sellerId: req.user._id });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const updatedShop = await Shop.findByIdAndUpdate(
      shop._id,
      req.body,
      { new: true }
    );

    res.json(updatedShop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete my shop (Authenticated users, own shop)
router.delete('/seller/my-shop', auth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ sellerId: req.user._id });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    await Shop.findByIdAndDelete(shop._id);
    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller stats (Authenticated users, own shop)
router.get('/seller/stats', auth, async (req, res) => {
  try {
    const shop = await Shop.findOne({ sellerId: req.user._id });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // TODO: Calculate real stats from orders and products
    const stats = {
      totalProducts: shop.totalProducts,
      totalSales: shop.totalSales,
      totalOrders: shop.totalOrders,
      averageRating: shop.averageRating,
      totalReviews: shop.totalReviews,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update shop status (Admin only)
router.put('/:id/status', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { status } = req.body;

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle featured (Admin only)
router.put('/:id/featured', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    shop.isFeatured = !shop.isFeatured;
    await shop.save();

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Set compliance (Admin only)
router.put('/:id/compliance', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { isCompliant, reason } = req.body;

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { isCompliant, nonComplianceReason: reason },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;