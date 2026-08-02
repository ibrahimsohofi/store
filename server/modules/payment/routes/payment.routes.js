import express from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { csrfProtection } from '../../middleware/csrf.js';

const router = express.Router();

router.post('/intent', requireAuth, csrfProtection, paymentController.createPaymentIntent);
router.post('/process', requireAuth, csrfProtection, paymentController.processPayment);
router.post('/webhook/:gateway(stripe|paypal)', paymentController.handleWebhook);
router.post('/:paymentId/refund', requireAuth, csrfProtection, paymentController.refundPayment);

export default router;
