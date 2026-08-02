import express from 'express';
import { checkoutController } from '../controllers/checkout.controller.js';

const router = express.Router();

router.get('/quote', checkoutController.getQuote);
router.post('/orders', checkoutController.createOrder);
router.get('/orders/:id', checkoutController.getOrder);

export default router;
