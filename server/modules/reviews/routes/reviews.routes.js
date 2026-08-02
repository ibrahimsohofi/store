import express from 'express';
import { reviewsController } from '../controllers/reviews.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { csrfProtection } from '../../middleware/csrf.js';
import { rateLimit } from '../../middleware/rateLimit.js';

const router = express.Router();

// Public routes
router.get('/products/:productId', reviewsController.getProductReviews);
router.get('/products/:ProductId/stats', reviewsController.getProductRatingStats);

// Customer routes
router.post('/', requireAuth, rateLimit('review'), csrfProtection, reviewsController.createReview);
router.get('/my-reviews', requireAuth, reviewsController.getCustomerReviews);

// Admin routes
router.get('/pending', requireAuth, requireAdmin, reviewsController.getPendingReviews);
router.put('/:id/approve', requireAuth, requireAdmin, csrfProtection, reviewsController.approveReview);
router.put('/:id/reject', requireAuth, requireAdmin, csrfProtection, reviewsController.rejectReview);
router.delete('/:id', requireAuth, requireAdmin, csrfProtection, reviewsController.deleteReview);

export default router;
