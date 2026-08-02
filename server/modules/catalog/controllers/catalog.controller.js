import { catalogService } from '../services/catalog.service.js';

export const catalogController = {
  async getCategories(req, res) {
    try {
      const categories = await catalogService.getCategories();
      res.json({ data: categories });
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getCategoryBySlug(req, res) {
    try {
      const { slug } = req.params;
      const category = await catalogService.getCategoryBySlug(slug);
      res.json({ data: category });
    } catch (error) {
      if (error.message === 'Category not found') {
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

  async getProducts(req, res) {
    try {
      const products = await catalogService.getProducts(req.query);
      res.json({ data: products });
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getProductBySlug(req, res) {
    try {
      const { slug } = req.params;
      const { product, related } = await catalogService.getProductWithRelated(slug);
      res.json({ data: { product, related } });
    } catch (error) {
      if (error.message === 'Product not found') {
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

  async searchProducts(req, res) {
    try {
      const { q, limit = 8 } = req.query;
      if (!q) {
        return res.status(400).json({
          error: {
            code: 'INVALID_QUERY',
            message: 'Search query is required',
          },
        });
      }
      const products = await catalogService.searchProducts(q, limit);
      res.json({ data: products });
    } catch (error) {
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getFilters(req, res) {
    try {
      const { category } = req.query;
      const filters = await catalogService.getFilters(category);
      res.json({ data: filters });
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
