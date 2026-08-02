import knex from '../../../config/knex.js';

export const reviewsRepo = {
  async createReview(data) {
    return knex('shop_reviews').insert({
      product_id: data.productId,
      customer_id: data.customerId,
      rating: data.rating,
      title: data.title,
      body: data.body,
      is_verified_purchase: data.isVerifiedPurchase || false,
      status: 'pending',
    }).returning('*');
  },

  async getReviewById(id) {
    return knex('shop_reviews').where({ id }).first();
  },

  async getReviewsByProductId(productId, query = {}) {
    let baseQuery = knex('shop_reviews')
      .where({ product_id: productId })
      .where('status', 'approved');

    if (query.rating) {
      baseQuery = baseQuery.where('rating', query.rating);
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const [reviews, [{ total }]] = await Promise.all([
      baseQuery.clone()
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      baseQuery.clone().count('* as total'),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit),
      },
    };
  },

  async getReviewsByCustomerId(customerId, query = {}) {
    let baseQuery = knex('shop_reviews').where({ customer_id: customerId });

    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const [reviews, [{ total }]] = await Promise.all([
      baseQuery.clone()
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      baseQuery.clone().count('* as total'),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit),
      },
    };
  },

  async getPendingReviews(query = {}) {
    let baseQuery = knex('shop_reviews').where({ status: 'pending' });

    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const [reviews, [{ total }]] = await Promise.all([
      baseQuery.clone()
        .orderBy('created_at', 'asc')
        .limit(limit)
        .offset(offset),
      baseQuery.clone().count('* as total'),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit),
      },
    };
  },

  async updateReviewStatus(id, status) {
    return knex('shop_reviews')
      .where({ id })
      .update({ status })
      .returning('*');
  },

  async deleteReview(id) {
    return knex('shop_reviews').where({ id }).del();
  },

  async getProductRatingStats(productId) {
    const stats = await knex('shop_reviews')
      .where({ product_id: productId, status: 'approved' })
      .select(
        knex.raw('COUNT(*) as count'),
        knex.raw('AVG(rating) as average_rating')
      )
      .first();

    const distribution = await knex('shop_reviews')
      .where({ product_id: productId, status: 'approved' })
      .select('rating')
      .select(knex.raw('COUNT(*) as count'))
      .groupBy('rating')
      .orderBy('rating', 'desc');

    return {
      count: stats?.count || 0,
      averageRating: stats?.average_rating || 0,
      distribution: distribution || [],
    };
  },
};
