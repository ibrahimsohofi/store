import { shippingService } from '../services/shipping.service.js';

export const shippingController = {
  async getZones(req, res) {
    try {
      const zones = await shippingService.getAvailableZones();
      res.json({ data: zones });
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getQuote(req, res) {
    try {
      const { postal_code, total_weight, order_value } = req.query;
      
      if (!postal_code) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: 'Postal code is required',
          },
        });
      }

      const quote = await shippingService.getShippingQuote(
        postal_code,
        parseFloat(total_weight) || 0,
        parseFloat(order_value) || 0
      );
      
      res.json({ data: quote });
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
