const mongoose = require('mongoose');

const orderStatusEnum = ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];
const paymentStatusEnum = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: orderStatusEnum, default: 'PENDING_PAYMENT' },
  paymentStatus: { type: String, enum: paymentStatusEnum, default: 'PENDING' },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    additionalInfo: String,
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    postalCode: String,
    country: String,
  },
  subtotal: { type: Number, required: true, default: 0 },
  shippingTotal: { type: Number, required: true, default: 0 },
  discountTotal: { type: Number, default: 0 },
  total: { type: Number, required: true, default: 0 },
  stripePaymentIntentId: String,
  stripeChargeId: String,
  paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  customerNote: String,
  adminNote: String,
  paidAt: Date,
  cancelledAt: Date,
  cancellationReason: String,
  parentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  isSubOrder: { type: Boolean, default: false },
}, { timestamps: true });

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ parentOrderId: 1 });
orderSchema.index({ stripePaymentIntentId: 1 });
orderSchema.index({ createdAt: -1 });

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `ORD-${year}-${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);