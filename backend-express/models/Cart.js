const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestId: { type: String }, // For guest users
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      variantId: { type: mongoose.Schema.Types.ObjectId },
      shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 },
      price: { type: Number, required: true },
      productSnapshot: {
        name: String,
        image: String,
        slug: String,
      },
      addedAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

// Indexes for faster queries
cartSchema.index({ userId: 1 });
cartSchema.index({ guestId: 1 });
cartSchema.index({ 'items.productId': 1 });

module.exports = mongoose.model('Cart', cartSchema);
