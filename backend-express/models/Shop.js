const mongoose = require('mongoose');

const shopStatusEnum = ['ACTIVE', 'INACTIVE', 'SUSPENDED'];

const shopSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  logo: String,
  banner: String,
  status: { type: String, enum: shopStatusEnum, default: 'ACTIVE' },
  categories: [String],
  shippingConfig: {
    enabled: { type: Boolean, default: true },
    flatRate: Number,
    freeShippingThreshold: Number,
    maxShippingCost: Number,
    estimatedDays: { type: Number, default: 3 },
    shippingZones: [String],
  },
  returnPolicy: String,
  privacyPolicy: String,
  socialMedia: {
    instagram: String,
    facebook: String,
    website: String,
  },
  totalProducts: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  totalOrders: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isCompliant: { type: Boolean, default: true },
  nonComplianceReason: String,
}, { timestamps: true });

// Indexes
shopSchema.index({ sellerId: 1 });
shopSchema.index({ slug: 1 });
shopSchema.index({ status: 1 });
shopSchema.index({ isFeatured: -1, averageRating: -1 });
shopSchema.index({ categories: 1 });
shopSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Shop', shopSchema);