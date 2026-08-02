import { reviewsService } from '../services/reviews.service.js';

export const reviewsController = {
  async createReview(req, res) {
    try {
      const { productId, rating, title, body } = req.body;
      const customerId = req.user.id;

      if (!productId || !rating) {
        return res.status(400).json({
          error: {
            code: 'INVALID_REQUEST',
            message: 'productId and rating are required',
          },
        });
      }

      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          error: {
            code: 'INVALID_RATING',
            message: 'Rating must be between 1 and 5',
          },
        });
      }

      const review = await reviewsService.createReview(customerId, {
        productId,
        rating,
        title,
        body,
      });

      res.status(201).json({ data: review });
    } catch (error) {
      console.error('Create review error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getProductReviews(req, res) {
    try {
      const { productId } = req.params;
      const query = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
        rating: req.query.rating,
      };

      const result = await reviewsService.getProductReviews(productId, query);
      res.json({ data: result });
    } catch (error) {
      console.error('Get product reviews error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getCustomerReviews(req, res) {
    try {
      const customerId = req.user.id;
      const query = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      };

      const result = await reviewsService.getCustomerReviews(customerId, query);
      res.json({ data: result });
    } catch (error) {
      console.error('Get customer reviews error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getPendingReviews(req, res) {
    try {
      const query = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      };

      const result = await reviewsService.getPendingReviews(query);
      res.json({ data: result });
    } catch (error) {
      console.error('Get pending reviews error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async approveReview(req, res) {
    try {
      const { id } = req.params;
      const review = await reviewsService.approveReview(id);
      res.json({ data: review });
    } catch (error) {
      console.error('Approve review error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async rejectReview(req, res) {
    try {
      const { id } = req.params;
      const review = await reviewsService.rejectReview(id);
      res.json({ data: review });
    } catch (error) {
      console.error('Reject review error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async deleteReview(req, res) {
    try {
      const { id } = req.params;
      await reviewsService.deleteReview(id);
      res.json({ data: { success: true } });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },

  async getProductRatingStats(req, res) {
    try {
      const { productId } = req.params;
      const stats = await reviewsService.getProductRatingStats(productId);
      res.json({ data: stats });
    } catch (error) {
      console.error('Get rating stats error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message,
        },
      });
    }
  },
};
