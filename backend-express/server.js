const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://72.62.71.97:3000',
    'http://soeurise-frontend:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/soeurise2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');
  await seedAdminIfNotExists();
})
.catch(err => console.error('MongoDB connection error:', err));

// Seed admin user
async function seedAdminIfNotExists() {
  try {
    console.log('Checking for admin user...');
    const User = require('./models/User');

    const existingAdmin = await User.findOne({ role: 'ADMIN' });
    if (existingAdmin) {
      console.log(`✓ Admin already exists: ${existingAdmin.email}`);
      return;
    }

    console.log('Creating default admin user...');
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 12);

    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Soeurise',
      email: 'admin@soeurise.com',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      phone: '+33123456789',
    });

    const savedAdmin = await adminUser.save();
    console.log(`✓ Admin user created successfully: ${savedAdmin.email} (ID: ${savedAdmin._id})`);
  } catch (error) {
    console.error('✗ Error seeding admin:', error?.message || error);
  }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/shipments', require('./routes/shipments'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/health', require('./routes/health'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});