const mongoose = require('mongoose');

const paymentMethodEnum = ['CARD', 'SEPA', 'OTHER'];
const paymentStatusEnum = ['PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_REFUNDED'];

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: paymentStatusEnum, default: 'PENDING' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'EUR' },
  paymentMethod: { type: String, enum: paymentMethodEnum, required: true },
  stripePaymentIntentId: { type: String, required: true, unique: true },
  stripeChargeId: String,
  stripePaymentMethodId: String,
  splits: [{
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: Number,
    platformCommission: Number,
    sellerPayout: Number,
    stripeTransferId: String,
    status: { type: String, default: 'PENDING' },
  }],
  totalPlatformCommission: { type: Number, default: 0 },
  refundedAmount: { type: Number, default: 0 },
  refunds: [{
    amount: Number,
    reason: String,
    stripeRefundId: String,
    refundedAt: Date,
  }],
  customerEmail: String,
  customerName: String,
  paidAt: Date,
  failedAt: Date,
  failureReason: String,
  webhookEvents: [String],
}, { timestamps: true });

// Indexes
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ customerId: 1, createdAt: -1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'splits.shopId': 1 });
paymentSchema.index({ 'splits.sellerId': 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);