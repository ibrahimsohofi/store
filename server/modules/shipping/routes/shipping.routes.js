import express from 'express';
import { shippingController } from '../controllers/shipping.controller.js';

const router = express.Router();

router.get('/zones', shippingController.getZones);
router.get('/quote', shippingController.getQuote);

export default router;
