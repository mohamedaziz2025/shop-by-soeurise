const mongoose = require('mongoose');

const userRoleEnum = ['CLIENT', 'SELLER', 'ADMIN'];
const userStatusEnum = ['ACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION'];

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  role: { type: String, enum: userRoleEnum, default: 'CLIENT' },
  status: { type: String, enum: userStatusEnum, default: 'ACTIVE' },
  avatar: String,
  address: String,
  city: String,
  postalCode: String,
  country: String,
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);