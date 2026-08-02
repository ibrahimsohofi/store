import knex from '../../../config/knex.js';

export const catalogRepo = {
  async getCategories() {
    return knex('categories')
      .where('is_active', true)
      .orderBy('position', 'asc')
      .select('*');
  },

  async getCategoryBySlug(slug) {
    return knex('categories')
      .where({ slug, is_active: true })
      .first();
  },

  async getProducts(query = {}) {
    const {
      category,
      brand,
      min,
      max,
      inStock,
      sort = 'relevance',
      page = 1,
      limit = 24,
      q,
    } = query;

    let dbQuery = knex('products')
      .where('is_active', true)
      .where('is_online', true);

    if (category) {
      dbQuery = dbQuery.where('category_id', category);
    }

    if (brand) {
      const brands = Array.isArray(brand) ? brand : [brand];
      dbQuery = dbQuery.whereIn('brand', brands);
    }

    if (min) {
      dbQuery = dbQuery.where('price', '>=', min);
    }

    if (max) {
      dbQuery = dbQuery.where('price', '<=', max);
    }

    if (inStock) {
      dbQuery = dbQuery.where('stock_quantity', '>', 0);
    }

    if (q) {
      dbQuery = dbQuery.where(function() {
        this.where('name', 'like', `%${q}%`)
          .orWhere('name_fr', 'like', `%${q}%`)
          .orWhere('name_ar', 'like', `%${q}%`)
          .orWhere('description', 'like', `%${q}%`)
          .orWhere('tags', 'like', `%${q}%`);
      });
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        dbQuery = dbQuery.orderBy('price', 'asc');
        break;
      case 'price_desc':
        dbQuery = dbQuery.orderBy('price', 'desc');
        break;
      case 'newest':
        dbQuery = dbQuery.orderBy('created_at', 'desc');
        break;
      case 'bestsellers':
        dbQuery = dbQuery.orderBy('sold_count', 'desc');
        break;
      default:
        dbQuery = dbQuery.orderBy('created_at', 'desc');
    }

    const offset = (page - 1) * limit;
    const products = await dbQuery
      .offset(offset)
      .limit(limit)
      .select('*');

    const [{ count }] = await dbQuery.clone().count('* as count').first();

    return {
      products,
      total: parseInt(count),
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    };
  },

  async getFilters(categoryId) {
    let baseQuery = knex('products')
      .where('is_active', true)
      .where('is_online', true);

    if (categoryId) {
      baseQuery = baseQuery.where('category_id', categoryId);
    }

    // Get brands
    const brands = await baseQuery
      .clone()
      .whereNotNull('brand')
      .groupBy('brand')
      .select('brand', knex.raw('COUNT(*) as count'))
      .orderBy('brand', 'asc');

    // Get price range
    const [{ min: minPrice, max: maxPrice }] = await baseQuery
      .clone()
      .select(knex.raw('MIN(price) as min, MAX(price) as max'))
      .first();

    // Get stock info
    const [{ inStock, outOfStock }] = await baseQuery
      .clone()
      .select(
        knex.raw('SUM(CASE WHEN stock_quantity > 0 THEN 1 ELSE 0 END) as inStock'),
        knex.raw('SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as outOfStock')
      )
      .first();

    return {
      brands: brands.map((b) => ({ name: b.brand, count: b.count })),
      priceRange: {
        min: minPrice || 0,
        max: maxPrice || 0,
      },
      stock: {
        inStock: inStock || 0,
        outOfStock: outOfStock || 0,
      },
    };
  },

  async getProductBySlug(slug) {
    return knex('products')
      .where({ slug, is_active: true, is_online: true })
      .first();
  },

  async getProductById(id) {
    return knex('products')
      .where({ id, is_active: true, is_online: true })
      .first();
  },

  async getRelatedProducts(productId, categoryId, limit = 4) {
    return knex('products')
      .where('is_active', true)
      .where('is_online', true)
      .where('id', '!=', productId)
      .where('category_id', categoryId)
      .limit(limit)
      .select('*');
  },

  async searchProducts(query, limit = 8) {
    return knex('products')
      .where('is_active', true)
      .where('is_online', true)
      .where(function() {
        this.where('name', 'like', `%${query}%`)
          .orWhere('name_fr', 'like', `%${query}%`)
          .orWhere('name_ar', 'like', `%${query}%`);
      })
      .limit(limit)
      .select('id', 'name', 'name_fr', 'name_ar', 'slug', 'price', 'image_url');
  },
};
