import express from 'express';
import { seoController } from '../controllers/seo.controller.js';

const router = express.Router();

router.get('/sitemap.xml', seoController.getSitemap);
router.get('/robots.txt', seoController.getRobotsTxt);

export default router;
