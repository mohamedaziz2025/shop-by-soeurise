const mongoose = require('mongoose');

const productStatusEnum = ['DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED'];

const productSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  status: { type: String, enum: productStatusEnum, default: 'DRAFT' },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 },
  mainImage: { type: String, required: true },
  images: [String],
  category: { type: String, required: true },
  tags: [String],
  stock: { type: Number, default: 0 },
  sku: String,
  dimensions: {
    weight: Number,
    length: Number,
    width: Number,
    height: Number,
  },
  hasVariants: { type: Boolean, default: false },
  metaTitle: String,
  metaDescription: String,
  viewsCount: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
  approvalNote: String,
}, { timestamps: true });

// Indexes
productSchema.index({ shopId: 1, status: 1 });
productSchema.index({ sellerId: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ isFeatured: -1, createdAt: -1 });
productSchema.index({ averageRating: -1, reviewsCount: -1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);