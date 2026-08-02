import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../../middleware/auth.js';
import { csrfProtection } from '../../middleware/csrf.js';
import { rateLimit } from '../../middleware/rateLimit.js';

const router = express.Router();

router.post('/register', rateLimit('register'), csrfProtection, authController.register);
router.post('/login', rateLimit('login'), csrfProtection, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/logout-all', requireAuth, authController.logoutAll);
router.get('/profile', requireAuth, authController.getProfile);
router.put('/profile', requireAuth, csrfProtection, authController.updateProfile);

export default router;
