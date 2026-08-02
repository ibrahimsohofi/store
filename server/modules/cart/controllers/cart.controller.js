import { cartService } from '../services/cart.service.js';

export const cartController = {
  async getCart(req, res) {
    try {
      const cartToken = req.cookies.cart_token;
      const customerId = req.user?.id;
      
      const cart = await cartService.getCart(cartToken, customerId);
      res.json({ data: cart });
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async addItem(req, res) {
    try {
      const { productId, qty = 1 } = req.body;
      const cartToken = req.cookies.cart_token;
      const customerId = req.user?.id;
      
      const cart = await cartService.addItem(cartToken, customerId, productId, qty);
      
      if (!req.cookies.cart_token && cart.cart?.token) {
        res.cookie('cart_token', cart.cart.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        });
      }
      
      res.json({ data: cart });
    } catch (error) {
      if (error.message === 'Product not found') {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else if (error.message === 'Insufficient stock') {
        res.status(400).json({
          error: {
            code: 'INSUFFICIENT_STOCK',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message,
          },
        });
      }
    }
  },

  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const { qty } = req.body;
      const cartToken = req.cookies.cart_token;
      const customerId = req.user?.id;
      
      const cart = await cartService.updateItem(cartToken, customerId, id, qty);
      res.json({ data: cart });
    } catch (error) {
      if (error.message === 'Cart not found') {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message,
          },
        });
      }
    }
  },

  async removeItem(req, res) {
    try {
      const { id } = req.params;
      const cartToken = req.cookies.cart_token;
      const customerId = req.user?.id;
      
      const cart = await cartService.removeItem(cartToken, customerId, id);
      res.json({ data: cart });
    } catch (error) {
      if (error.message === 'Cart not found') {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message,
          },
        });
      }
    }
  },

  async clearCart(req, res) {
    try {
      const cartToken = req.cookies.cart_token;
      const customerId = req.user?.id;
      
      const cart = await cartService.clearCart(cartToken, customerId);
      res.json({ data: cart });
    } catch (error) {
      if (error.message === 'Cart not found') {
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: error.message,
          },
        });
      } else {
        res.status(500).json({
          error: {
            code: 'INTERNAL_ERROR',
            message: error.message,
          },
        });
      }
    }
  },

  async mergeCart(req, res) {
    try {
      const { sourceToken } = req.body;
      const customerId = req.user?.id;
      
      if (!customerId) {
        return res.status(401).json({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
      }
      
      const cart = await cartService.mergeCarts(sourceToken, customerId);
      res.clearCookie('cart_token');
      res.json({ data: cart });
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },
};
