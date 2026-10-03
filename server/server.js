import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (e) {}

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { seedProducts } from './seed/seedData.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Disable information disclosure headers
app.disable('x-powered-by');

// Apply security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false // Allows flexibility when serving frontend assets
  })
);

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev fallback
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Parse JSON request payloads with size limits to protect against memory exhaustion
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// General API Rate Limiting (e.g. 500 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP. Please try again later.' }
});
app.use('/api/', apiLimiter);

// Strict Rate Limiting for Authentication Routes to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // 30 attempts per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

mongoose.set('bufferCommands', false);

// In-Memory Data Store Fallback for instant standalone running
export let inMemoryProducts = [...seedProducts.map((p, idx) => ({ ...p, _id: `mem_prod_${idx + 1}` }))];
export let inMemoryOrders = [
  {
    _id: 'mem_order_1',
    orderNumber: 'AUR-984210',
    items: [
      {
        product: 'mem_prod_1',
        name: 'Celeste Diamond Ring',
        price: 48900,
        quantity: 1,
        selectedSize: '7',
        selectedMetal: '18K Gold',
        image: '/assets/category_rings.jpg'
      }
    ],
    shippingAddress: {
      fullName: 'Demo Customer',
      street: '100 Premium Boulevard',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      phone: '+91 98000 00000'
    },
    paymentMethod: 'UPI / Razorpay',
    paymentStatus: 'completed',
    trackingNumber: 'AUR-EX-887412',
    orderStatus: 'crafting',
    subtotal: 48900,
    discount: 0,
    shippingFee: 0,
    totalAmount: 48900,
    createdAt: new Date().toISOString(),
    timeline: [
      { status: 'pending', label: 'Order Placed', description: 'Order placed.', date: new Date(), isCompleted: true },
      { status: 'confirmed', label: 'Confirmed', description: 'Order verified by concierge team.', date: new Date(), isCompleted: true },
      { status: 'crafting', label: 'Crafting & Setting', description: 'Artisan currently setting diamonds.', date: new Date(), isCompleted: true },
      { status: 'quality_check', label: 'Quality & BIS Hallmark', description: 'Scheduled for inspection.', date: null, isCompleted: false },
      { status: 'shipped', label: 'Insured Shipping', description: 'Preparing courier pouch.', date: null, isCompleted: false },
      { status: 'out_for_delivery', label: 'Out for Delivery', description: 'Pending dispatch.', date: null, isCompleted: false },
      { status: 'delivered', label: 'Delivered', description: 'Pending delivery.', date: null, isCompleted: false }
    ]
  }
];

// Database connection
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aurelia_jewellery';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.log('MongoDB connection fallback to in-memory store (Standalone Mode)');
  }
};
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint (does not disclose environment or secrets)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'AURÉLIA Fine Jewellery', timestamp: new Date().toISOString() });
});

// Serve frontend static assets in production if needed
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

// Global 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'Requested endpoint not found' });
});

// Centralized error handling middleware to avoid confidential stack trace / system leaks
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err.message);
  const isDev = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    message: isDev ? err.message : 'An unexpected server error occurred. Please try again later.'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`AURÉLIA Server running on port ${PORT}`);
});
