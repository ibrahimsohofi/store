import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { httpLogger } from './config/logger.js';
import { errorHandler } from './middleware/error.js';
import { setCsrfCookie } from './middleware/csrf.js';
import { rateLimit } from './middleware/rateLimit.js';
import { securityHeaders, auditLogger, sanitizeInput } from './middleware/security.js';
import './config/sentry.js';

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(auditLogger);
app.use(sanitizeInput);

// CORS
app.use(cors({
  origin: env.SITE_URL,
  credentials: true,
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// CSRF protection
app.use(setCsrfCookie);

// Rate limiting
app.use(rateLimit('global'));

// Request logging
app.use(httpLogger());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
import catalogRoutes from './modules/catalog/routes/catalog.routes.js';
import cartRoutes from './modules/cart/routes/cart.routes.js';
import checkoutRoutes from './modules/checkout/routes/checkout.routes.js';
import seoRoutes from './modules/seo/routes/seo.routes.js';
import shippingRoutes from './modules/shipping/routes/shipping.routes.js';
import invoiceRoutes from './modules/invoice/routes/invoice.routes.js';
import uploadRoutes from './modules/upload/routes/upload.routes.js';
import paymentRoutes from './modules/payment/routes/payment.routes.js';
import authRoutes from './modules/auth/routes/auth.routes.js';
import adminRoutes from './modules/admin/routes/admin.routes.js';
import reviewsRoutes from './modules/reviews/routes/reviews.routes.js';
app.use('/api/v1/catalog', catalogRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/checkout', checkoutRoutes);
app.use('/api/v1/shipping', shippingRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reviews', reviewsRoutes);
app.use(seoRoutes);

// Error handling
app.use(errorHandler);

const PORT = env.API_PORT || 4001;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
