import redis from '../../../config/redis.js';
import { catalogRepo } from '../repos/catalog.repo.js';

export const catalogService = {
  async getCategories() {
    return await catalogRepo.getCategories();
  },

  async getCategoryBySlug(slug) {
    const category = await catalogRepo.getCategoryBySlug(slug);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  },

  async getProducts(query) {
    return await catalogRepo.getProducts(query);
  },

  async getProductBySlug(slug) {
    const product = await catalogRepo.getProductBySlug(slug);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async getProductById(id) {
    const product = await catalogRepo.getProductById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async getProductWithRelated(slug) {
    const product = await this.getProductBySlug(slug);
    const related = await catalogRepo.getRelatedProducts(
      product.id,
      product.category_id
    );
    return { product, related };
  },

  async searchProducts(query, limit = 8) {
    const cacheKey = `search:${query}`;
    
    try {
      // Try to get from cache
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      // If not in cache, query database
      const products = await catalogRepo.searchProducts(query, limit);
      
      // Cache for 5 minutes (300 seconds)
      await redis.setex(cacheKey, 300, JSON.stringify(products));
      
      return products;
    } catch (error) {
      // If Redis fails, fall back to direct query
      console.error('Redis cache error:', error);
      return await catalogRepo.searchProducts(query, limit);
    }
  },

  async getFilters(categoryId) {
    return await catalogRepo.getFilters(categoryId);
  },
};
