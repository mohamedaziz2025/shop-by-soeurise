// RBAC Middleware
const rbac = (allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has required role
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }

    // Special case: if SELLER role is required, also allow users who have a shop
    if (allowedRoles.includes('SELLER') && req.user.role === 'CLIENT') {
      try {
        const Shop = require('../models/Shop');
        const shop = await Shop.findOne({ sellerId: req.user._id });
        if (shop) {
          return next();
        }
      } catch (error) {
        console.error('Error checking shop ownership:', error);
      }
    }

    return res.status(403).json({ message: 'Insufficient permissions' });
  };
};

module.exports = rbac;