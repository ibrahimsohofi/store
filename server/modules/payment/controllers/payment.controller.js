import { paymentService } from '../services/payment.service.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const createPaymentSchema = z.object({
  orderNumber: z.string(),
  paymentMethod: z.enum(['cod', 'card', 'paypal']),
});

const processPaymentSchema = z.object({
  paymentId: z.number(),
  paymentData: z.object({
    token: z.string().optional(),
    payerId: z.string().optional(),
  }).optional(),
});

export const paymentController = {
  async createPaymentIntent(req, res) {
    try {
      const { orderNumber, paymentMethod } = req.body;
      
      const intent = await paymentService.createPaymentIntent(orderNumber, paymentMethod);
      
      res.json({ data: intent });
    } catch (error) {
      console.error('Create payment intent error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async processPayment(req, res) {
    try {
      const { paymentId, paymentData } = req.body;
      
      const result = await paymentService.processPayment(paymentId, paymentData);
      
      res.json({ data: result });
    } catch (error) {
      console.error('Process payment error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async handleWebhook(req, res) {
    try {
      const { gateway } = req.params;
      const signature = req.headers['stripe-signature'] || req.headers['paypal-transmission-sig'];
      
      const result = await paymentService.handleWebhook(gateway, req.body, signature);
      
      res.json({ data: result });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async refundPayment(req, res) {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;
      
      const result = await paymentService.refundPayment(paymentId, amount);
      
      res.json({ data: result });
    } catch (error) {
      console.error('Refund payment error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },
};
