const express = require('express');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payment = require('../models/Payment');

const router = express.Router();

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
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;

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

module.exports = router;