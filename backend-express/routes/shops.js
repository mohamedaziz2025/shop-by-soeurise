const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Shop = require('../models/Shop');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

// Configuration Multer pour l'upload de logos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'logos');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'));
    }
  }
});

// Get all shops (public)
router.get('/', async (req, res) => {
  try {
    const { status = 'ACTIVE', category, isFeatured } = req.query;

    const query = { status };
    if (category) query.categories = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    const shops = await Shop.find(query)
      .populate('sellerId', 'firstName lastName')
      .sort({ isFeatured: -1, averageRating: -1, createdAt: -1 });

    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get partners (public) - AVANT /:id
router.get('/partners', async (req, res) => {
  try {
    const partners = await Shop.find({ isFeatured: true, status: 'ACTIVE' })
      .populate('sellerId', 'firstName lastName')
      .limit(10);

    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get shop by slug (public) - AVANT /:id
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

// Create shop (Authenticated users)
router.post('/', auth, upload.single('logo'), [
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

    // Convertir category en categories si nécessaire
    if (req.body.category && !req.body.categories) {
      shopData.categories = [req.body.category];
    }

    // Ajouter le logo si uploadé
    if (req.file) {
      shopData.logo = `/uploads/logos/${req.file.filename}`;
    }

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

// Upload shop logo (Authenticated users, own shop)
router.post('/seller/logo', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const shop = await Shop.findOne({ sellerId: req.user._id });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const publicUrl = `/uploads/logos/${req.file.filename}`;
    shop.logo = publicUrl;
    await shop.save();

    res.json({ logo: publicUrl, shop });
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

    // Count active products
    const Product = require('../models/Product');
    const activeProducts = await Product.countDocuments({
      shopId: shop._id,
      status: 'ACTIVE'
    });

    // For now, use shop stored values (should be updated periodically)
    // TODO: Implement real-time calculation from orders when OrderItem model is available
    const stats = {
      // Legacy fields
      totalProducts: activeProducts,
      totalSales: shop.totalSales || 0,
      totalOrders: shop.totalOrders || 0,
      averageRating: shop.averageRating || 0,
      totalReviews: shop.totalReviews || 0,

      // Frontend expected fields
      revenue: shop.totalSales || 0,
      ordersCount: shop.totalOrders || 0,
      pendingOrders: 0, // TODO: calculate from orders
      activeProducts: activeProducts,
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching seller stats:', error);
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