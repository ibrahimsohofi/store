import { reviewsRepo } from '../repos/reviews.repo.js';
import { checkoutRepo } from '../checkout/repos/checkout.repo.js';

export const reviewsService = {
  async createReview(customerId, data) {
    // Check if customer has purchased this product
    const hasPurchased = await checkoutRepo.hasCustomerPurchasedProduct(
      customerId,
      data.productId
    );

    const reviewData = {
      ...data,
      customerId,
      isVerifiedPurchase: hasPurchased,
    };

    return await reviewsRepo.createReview(reviewData);
  },

  async getProductReviews(productId, query) {
    return await reviewsRepo.getReviewsByProductId(productId, query);
  },

  async getCustomerReviews(customerId, query) {
    return await reviewsRepo.getReviewsByCustomerId(customerId, query);
  },

  async getPendingReviews(query) {
    return await reviewsRepo.getPendingReviews(query);
  },

  async approveReview(reviewId) {
    return await reviewsRepo.updateReviewStatus(reviewId, 'approved');
  },

  async rejectReview(reviewId) {
    return await reviewsRepo.updateReviewStatus(reviewId, 'rejected');
  },

  async deleteReview(reviewId) {
    return await reviewsRepo.deleteReview(reviewId);
  },

  async getProductRatingStats(productId) {
    return await reviewsRepo.getProductRatingStats(productId);
  },
};
