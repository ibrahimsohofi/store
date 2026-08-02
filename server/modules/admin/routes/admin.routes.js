import express from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../../middleware/auth.js';
import { csrfProtection } from '../../middleware/csrf.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(requireAuth);
router.use(requireAdmin);

router.get('/dashboard', adminController.getDashboard);
router.get('/orders', adminController.getOrders);
router.put('/orders/:id/status', csrfProtection, adminController.updateOrderStatus);
router.get('/products', adminController.getProducts);
router.put('/products/:id', csrfProtection, adminController.updateProduct);
router.get('/customers', adminController.getCustomers);
router.get('/reports/sales', adminController.getSalesReport);

export default router;
