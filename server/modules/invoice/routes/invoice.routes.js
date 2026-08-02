import express from 'express';
import { invoiceController } from '../controllers/invoice.controller.js';

const router = express.Router();

router.get('/:orderNumber', invoiceController.getInvoicePdf);

export default router;
