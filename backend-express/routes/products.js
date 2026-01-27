const express = require('express');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/products');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all products (public)
router.get('/', async (req, res) => {
  try {
    const {
      shopId,
      shopSlug,
      category,
      status = 'ACTIVE',
      search,
      minPrice,
      maxPrice,
      tags,
      isFeatured,
      page = 1,
      limit = 10,
    } = req.query;

    const query = { status };

    if (shopId) query.shopId = shopId;
    if (shopSlug) {
      // Find shop by slug and use its ID
      const shop = await Shop.findOne({ slug: shopSlug });
      if (shop) {
        query.shopId = shop._id;
      }
    }
    if (category) query.category = category;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .populate('shopId', 'name')
      .populate('sellerId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shopId')
      .populate('sellerId', 'firstName lastName email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    await Product.findByIdAndUpdate(req.params.id, { $inc: { viewsCount: 1 } });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get product by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate('shopId')
      .populate('sellerId', 'firstName lastName email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Increment view count
    await Product.findByIdAndUpdate(product._id, { $inc: { viewsCount: 1 } });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (Seller only)
router.post('/', auth, rbac(['SELLER']), upload.array('images', 8), [
  body('name').trim().isLength({ min: 1 }),
  body('description').isLength({ min: 1 }),
  body('price').isFloat({ min: 0 }),
  body('category').trim().isLength({ min: 1 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the seller's shop
    const shop = await Shop.findOne({ sellerId: req.user._id });
    if (!shop) {
      return res.status(400).json({ message: 'You must create a shop before adding products' });
    }

    const productData = {
      ...req.body,
      sellerId: req.user._id,
      shopId: shop._id,
      slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: 'ACTIVE', // Products created by sellers are automatically active
      isApproved: true, // Products created by sellers are automatically approved
    };

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/products/${file.filename}`);
      productData.mainImage = `/uploads/products/${req.files[0].filename}`;
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Product slug already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Get seller's products (Seller only)
router.get('/seller/my-products', auth, rbac(['SELLER']), async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id })
      .populate('shopId', 'name')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (Seller only, own products)
router.put('/:id', auth, rbac(['SELLER']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (Seller only, own products)
router.delete('/:id', auth, rbac(['SELLER']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve product (Admin only)
router.put('/:id/approve', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { isApproved, note } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved, approvalNote: note },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle featured (Admin only)
router.put('/:id/featured', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;