const express = require('express');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Configure multer for file uploads
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

// Get dashboard stats
router.get('/dashboard/stats', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const [
      totalUsers,
      totalShops,
      totalProducts,
      totalOrders,
      pendingShops,
      pendingProducts,
      activeShops,
    ] = await Promise.all([
      User.countDocuments(),
      Shop.countDocuments({ status: 'ACTIVE' }),
      Product.countDocuments({ status: 'ACTIVE' }),
      Order.countDocuments({ isSubOrder: false }),
      Shop.countDocuments({ status: 'PENDING_APPROVAL' }),
      Product.countDocuments({ isApproved: false }),
      Shop.countDocuments({ status: 'ACTIVE' }),
    ]);

    // Monthly revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyOrders = await Order.find({
      isSubOrder: false,
      paymentStatus: 'PAID',
      paidAt: { $gte: startOfMonth },
    });

    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);

    // Monthly commission
    const monthlyPayments = await Payment.find({
      status: 'SUCCEEDED',
      paidAt: { $gte: startOfMonth },
    });

    const monthlyCommission = monthlyPayments.reduce(
      (sum, payment) => sum + payment.totalPlatformCommission,
      0,
    );

    // New users this month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // Pending orders
    const pendingOrders = await Order.countDocuments({
      isSubOrder: false,
      status: { $in: ['PENDING_PAYMENT', 'PROCESSING'] },
    });

    res.json({
      totalUsers,
      totalShops,
      activeShops,
      totalProducts,
      totalOrders,
      pendingShops,
      pendingProducts,
      monthlyRevenue,
      monthlyCommission,
      newUsersThisMonth,
      pendingOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get sales stats
router.get('/sales/stats', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const orders = await Order.find({
      isSubOrder: false,
      paymentStatus: 'PAID',
      paidAt: { $gte: start, $lte: end },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Platform commission
    const payments = await Payment.find({
      status: 'SUCCEEDED',
      paidAt: { $gte: start, $lte: end },
    });

    const totalCommission = payments.reduce(
      (sum, payment) => sum + payment.totalPlatformCommission,
      0,
    );

    res.json({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalCommission,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top shops
router.get('/shops/top', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const shops = await Shop.find({ status: 'ACTIVE' })
      .sort({ totalSales: -1 })
      .limit(limit)
      .select('name slug totalSales totalOrders averageRating');

    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top products
router.get('/products/top', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await Product.find({ status: 'ACTIVE' })
      .sort({ salesCount: -1 })
      .limit(limit)
      .populate('shopId', 'name slug')
      .select('name slug mainImage salesCount averageRating price');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending shops
router.get('/shops/pending', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const shops = await Shop.find({ status: 'PENDING_APPROVAL' })
      .populate('sellerId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(shops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending products
router.get('/products/pending', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const products = await Product.find({ isApproved: false })
      .populate('shopId', 'name slug')
      .populate('sellerId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent users
router.get('/users/recent', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent orders
router.get('/orders/recent', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const orders = await Order.find({ isSubOrder: false })
      .populate('customerId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get commissions report
router.get('/commissions/report', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);

    const payments = await Payment.find({
      status: 'SUCCEEDED',
      paidAt: { $gte: start, $lte: end },
    }).populate('orderId').sort({ paidAt: -1 });

    const commissionsByShop = new Map();

    for (const payment of payments) {
      for (const split of payment.splits) {
        const shopId = split.shopId.toString();

        if (!commissionsByShop.has(shopId)) {
          commissionsByShop.set(shopId, {
            shopId,
            totalSales: 0,
            totalCommission: 0,
            orderCount: 0,
          });
        }

        const shopData = commissionsByShop.get(shopId);
        shopData.totalSales += split.amount;
        shopData.totalCommission += split.platformCommission;
        shopData.orderCount += 1;
      }
    }

    res.json(Array.from(commissionsByShop.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get daily sales
router.get('/sales/daily', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const orders = await Order.find({
      isSubOrder: false,
      paymentStatus: 'PAID',
      paidAt: { $gte: startDate },
    });

    // Group by day
    const salesByDay = new Map();
    const dateFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'short' });

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      date.setHours(0, 0, 0, 0);
      const dayLabel = dateFormatter.format(date);
      salesByDay.set(date.toDateString(), {
        label: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
        value: 0,
        orders: 0,
      });
    }

    orders.forEach((order) => {
      const orderDate = new Date(order.paidAt);
      orderDate.setHours(0, 0, 0, 0);
      const dateKey = orderDate.toDateString();

      if (salesByDay.has(dateKey)) {
        const dayData = salesByDay.get(dateKey);
        dayData.value += order.total;
        dayData.orders += 1;
      }
    });

    res.json(Array.from(salesByDay.values()));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories stats
router.get('/categories/stats', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const products = await Product.find({ status: 'ACTIVE' });
    const categoriesMap = new Map();
    const totalProducts = products.length;

    products.forEach((product) => {
      const category = product.category || 'Non catégorisé';
      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, {
          name: category,
          count: 0,
          totalSales: 0,
        });
      }

      const catData = categoriesMap.get(category);
      catData.count += 1;
      catData.totalSales += product.salesCount || 0;
    });

    const categories = Array.from(categoriesMap.values())
      .map((cat) => ({
        ...cat,
        percentage: totalProducts > 0 ? Math.round((cat.count / totalProducts) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users with filters
router.get('/users', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { role, status } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve product (Admin only) - Alternative route for compatibility
router.put('/products/:id/approve', auth, rbac(['ADMIN']), async (req, res) => {
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

// Get all shops (Admin only)
router.get('/shops', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const shops = await Shop.find(query)
      .populate('sellerId', 'firstName lastName email')
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

// Get shop by ID (Admin only)
router.get('/shops/:id', auth, rbac(['ADMIN']), async (req, res) => {
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

// Update shop (Admin only)
router.put('/shops/:id', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { name, description, category, location } = req.body;

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { name, description, category, location },
      { new: true }
    ).populate('sellerId', 'firstName lastName email');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete shop (Admin only)
router.delete('/shops/:id', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve shop (Admin only)
router.put('/shops/:id/approve', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { status: 'APPROVED' },
      { new: true }
    ).populate('sellerId', 'firstName lastName email');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject shop (Admin only)
router.put('/shops/:id/reject', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { reason } = req.body;

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'REJECTED',
        rejectionReason: reason 
      },
      { new: true }
    ).populate('sellerId', 'firstName lastName email');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Suspend shop (Admin only)
router.put('/shops/:id/suspend', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { reason } = req.body;

    const shop = await Shop.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'SUSPENDED',
        suspensionReason: reason 
      },
      { new: true }
    ).populate('sellerId', 'firstName lastName email');

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json(shop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all products (Admin only)
router.get('/products', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { status, isApproved, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';

    const products = await Product.find(query)
      .populate('shopId', 'name slug')
      .populate('sellerId', 'firstName lastName email')
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

// Get all orders (Admin only)
router.get('/orders', auth, rbac(['ADMIN']), async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;
    const query = { isSubOrder: false };
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('customerId', 'firstName lastName email')
      .populate('items.productId', 'name slug mainImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create shop for user (Admin only)
router.post('/shops', auth, rbac(['ADMIN']), upload.single('logo'), async (req, res) => {
  try {
    const {
      sellerId,
      name,
      description,
      category,
      categories,
      shippingPrice,
      phone,
      address,
      city,
      postalCode,
      country,
      returnPolicy,
      location
    } = req.body;

    // Validate required fields
    if (!sellerId || !name) {
      return res.status(400).json({ message: 'sellerId and name are required' });
    }

    // Check if user exists
    const user = await User.findById(sellerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has a shop
    const existingShop = await Shop.findOne({ sellerId });
    if (existingShop) {
      return res.status(400).json({ message: 'User already has a shop' });
    }

    // Build location string from address components
    let locationString = location;
    if (!locationString && (address || city || postalCode || country)) {
      const addressParts = [address, city, postalCode, country].filter(Boolean);
      locationString = addressParts.join(', ');
    }

    const shopData = {
      name,
      description,
      category: category || (categories && categories.length > 0 ? categories[0] : undefined),
      categories: categories || (category ? [category] : []),
      sellerId,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      status: 'ACTIVE', // Admin-created shops are automatically active
      // Contact information
      phone,
      address,
      city,
      postalCode,
      country: country || 'France',
      // Business information
      returnPolicy,
      // Shipping configuration
      shippingConfig: shippingPrice ? {
        enabled: true,
        flatRate: parseFloat(shippingPrice),
      } : undefined,
    };

    // Add logo if uploaded
    if (req.file) {
      shopData.logo = `/uploads/logos/${req.file.filename}`;
    }

    const shop = new Shop(shopData);
    await shop.save();

    // Update user role to SELLER if not already
    if (user.role !== 'SELLER') {
      await User.findByIdAndUpdate(sellerId, { role: 'SELLER' });
    }

    res.status(201).json(shop);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Shop slug already exists' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// Configure multer for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'products');
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

const productUpload = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Create product for user/shop (Admin only)
router.post('/products', auth, rbac(['ADMIN']), productUpload.array('images', 8), async (req, res) => {
  try {
    const {
      shopId,
      name,
      description,
      shortDescription,
      price,
      category,
      tags,
      stock,
      isFeatured
    } = req.body;

    // Validate required fields
    if (!shopId || !name || !description || !price || !category) {
      return res.status(400).json({
        message: 'shopId, name, description, price, and category are required'
      });
    }

    // Check if shop exists and get sellerId
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const sellerId = shop.sellerId;

    // Check if user exists
    const user = await User.findById(sellerId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productData = {
      name,
      description,
      shortDescription,
      price: Number(price),
      category,
      sellerId,
      shopId,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      stock: stock ? Number(stock) : 0,
      isFeatured: isFeatured === 'true',
      status: 'ACTIVE', // Admin-created products are automatically active
      isApproved: true, // Admin-created products are automatically approved
    };

    // Handle tags
    if (tags) {
      productData.tags = Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim());
    }

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

module.exports = router;