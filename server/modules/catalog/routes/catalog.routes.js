import express from 'express';
import { catalogController } from '../controllers/catalog.controller.js';

const router = express.Router();

router.get('/categories', catalogController.getCategories);
router.get('/categories/:slug', catalogController.getCategoryBySlug);
router.get('/products', catalogController.getProducts);
router.get('/products/:slug', catalogController.getProductBySlug);
router.get('/search/suggest', catalogController.searchProducts);
router.get('/filters', catalogController.getFilters);

export default router;
