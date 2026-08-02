import { checkoutService } from '../services/checkout.service.js';

export const checkoutController = {
  async getQuote(req, res) {
    try {
      const cartToken = req.cookies.cart_token;
      const customerId = req.user?.id;
      
      const quote = await checkoutService.getQuote(cartToken, customerId);
      res.json({ data: quote });
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

  async createOrder(req, res) {
    try {
      const data = req.body;
      const cartToken = req.cookies.cart_token;
      const customerId = req.user?.id;
      
      const order = await checkoutService.createOrder({
        ...data,
        customerId,
        cartToken,
      });
      
      res.status(201).json({ data: order });
    } catch (error) {
      if (error.message === 'Cart not found' || error.message === 'Cart is empty') {
        res.status(400).json({
          error: {
            code: 'INVALID_CART',
            message: error.message,
          },
        });
      } else if (error.message.startsWith('Insufficient stock')) {
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

  async getOrder(req, res) {
    try {
      const { id } = req.params;
      const customerId = req.user?.id;
      
      const order = await checkoutService.getOrder(id, customerId);
      res.json({ data: order });
    } catch (error) {
      if (error.message === 'Order not found' || error.message === 'Access denied') {
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
};
