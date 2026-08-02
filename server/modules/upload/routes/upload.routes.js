import express from 'express';
import { uploadController, uploadMiddleware } from '../controllers/upload.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = express.Router();

router.post('/image', requireAuth, uploadMiddleware, uploadController.uploadImage);

export default router;
