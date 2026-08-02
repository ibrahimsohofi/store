import { authService } from '../services/auth.service.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export const authController = {
  async register(req, res) {
    try {
      const result = await authService.register(req.body);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      // Set access token as httpOnly cookie
      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      
      res.json({ data: { user: result.user } });
    } catch (error) {
      console.error('Register error:', error);
      res.status(400).json({
        error: {
          code: 'REGISTRATION_ERROR',
          message: error.message,
        },
      });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      // Set refresh token as httpOnly cookie
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      // Set access token as httpOnly cookie
      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      
      res.json({ data: { user: result.user } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(401).json({
        error: {
          code: 'AUTH_ERROR',
          message: error.message,
        },
      });
    }
  },

  async refresh(req, res) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refresh(refreshToken);
      
      // Set new access token as httpOnly cookie
      res.cookie('access_token', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      
      // Update refresh token cookie
      res.cookie('refresh_token', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });
      
      res.json({ data: { user: result.user } });
    } catch (error) {
      console.error('Refresh error:', error);
      res.status(401).json({
        error: {
          code: 'REFRESH_ERROR',
          message: error.message,
        },
      });
    }
  },

  async logout(req, res) {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      
      res.json({ data: { success: true } });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: {
          code: 'LOGOUT_ERROR',
          message: error.message,
        },
      });
    }
  },

  async logoutAll(req, res) {
    try {
      await authService.logoutAll(req.user.id);
      
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      
      res.json({ data: { success: true } });
    } catch (error) {
      console.error('Logout all error:', error);
      res.status(500).json({
        error: {
          code: 'LOGOUT_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getProfile(req, res) {
    try {
      const user = await authService.updateProfile(req.user.id, {});
      res.json({ data: user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async updateProfile(req, res) {
    try {
      const user = await authService.updateProfile(req.user.id, req.body);
      res.json({ data: user });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },
};
