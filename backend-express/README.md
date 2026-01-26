# Backend Express - Shop Soeurise

Alternative backend implementation using Node.js, Express, MongoDB, and RBAC (Role-Based Access Control).

## Features

- **Authentication**: JWT-based authentication
- **Authorization**: RBAC with roles (CLIENT, SELLER, ADMIN)
- **User Management**: Registration, login, profile management
- **Product Management**: CRUD operations with role-based permissions
- **Cart, Orders, Payments, Shipments**: Basic structure implemented
- **Reviews, Shops, Admin**: Basic structure implemented
- **Health Check**: Database connectivity monitoring

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env` and update the values.

3. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/password` - Change password
- `DELETE /api/users/:id` - Delete user (Admin only)

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID (public)
- `GET /api/products/slug/:slug` - Get product by slug (public)
- `POST /api/products` - Create product (Seller only)
- `GET /api/products/seller/my-products` - Get seller's products (Seller only)
- `PUT /api/products/:id` - Update product (Seller only)
- `DELETE /api/products/:id` - Delete product (Seller only)
- `PUT /api/products/:id/approve` - Approve product (Admin only)
- `PUT /api/products/:id/featured` - Toggle featured (Admin only)

### Other Modules
- `/api/cart` - Cart management
- `/api/orders` - Order management
- `/api/payments` - Payment processing
- `/api/shipments` - Shipment tracking
- `/api/reviews` - Product reviews
- `/api/admin` - Admin dashboard
- `/api/shops` - Shop management
- `/api/health` - Health check

## RBAC (Role-Based Access Control)

- **CLIENT**: Can view products, manage own profile, place orders
- **SELLER**: All client permissions + create/manage own products and shops
- **ADMIN**: All permissions + user management, product moderation, system administration

## Security

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- CORS enabled
- Helmet for security headers
- Input validation with express-validator

## Database

Uses MongoDB with Mongoose ODM. Models include:
- User
- Product
- (Other models can be added as needed)

## Development

The server runs on port 3001 by default. Make sure MongoDB is running locally or update the MONGODB_URI in .env.