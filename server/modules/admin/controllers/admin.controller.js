import { adminService } from '../services/admin.service.js';

export const adminController = {
  async getDashboard(req, res) {
    try {
      const dashboard = await adminService.getDashboard();
      res.json({ data: dashboard });
    } catch (error) {
      console.error('Dashboard error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getOrders(req, res) {
    try {
      const query = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };
      
      const result = await adminService.getOrders(query);
      res.json({ data: result });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const order = await adminService.updateOrderStatus(id, status);
      res.json({ data: order });
    } catch (error) {
      console.error('Update order status error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getProducts(req, res) {
    try {
      const query = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        category: req.query.category,
        search: req.query.search,
        inStockOnly: req.query.inStockOnly === 'true',
      };
      
      const result = await adminService.getProducts(query);
      res.json({ data: result });
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const product = await adminService.updateProduct(id, req.body);
      res.json({ data: product });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getCustomers(req, res) {
    try {
      const query = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
        search: req.query.search,
      };
      
      const result = await adminService.getCustomers(query);
      res.json({ data: result });
    } catch (error) {
      console.error('Get customers error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getSalesReport(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: 'startDate and endDate are required',
          },
        });
      }
      
      const report = await adminService.getSalesReport(startDate, endDate);
      res.json({ data: report });
    } catch (error) {
      console.error('Get sales report error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },
};
