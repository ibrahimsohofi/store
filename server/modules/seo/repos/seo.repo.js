import knex from '../../../config/knex.js';

export const seoRepo = {
  async getAllProducts() {
    return knex('products')
      .where('is_active', true)
      .where('is_online', true)
      .select('id', 'slug', 'updated_at');
  },

  async getAllCategories() {
    return knex('categories')
      .where('is_active', true)
      .select('id', 'slug', 'updated_at');
  },

  async getAllPages() {
    // Static pages - for now return a list of known pages
    return [
      { slug: 'cgv', updated_at: new Date() },
      { slug: 'privacy', updated_at: new Date() },
      { slug: 'returns', updated_at: new Date() },
      { slug: 'about', updated_at: new Date() },
      { slug: 'contact', updated_at: new Date() },
    ];
  },
};
