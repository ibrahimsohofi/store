import knex from '../../../config/knex.js';

export const adminRepo = {
  async getDashboardStats() {
    const [
      [{ totalOrders }],
      [{ totalRevenue }],
      [{ totalCustomers }],
      [{ totalProducts }],
      [{ pendingOrders }],
    ] = await Promise.all([
      knex('shop_orders').count('* as totalOrders').where('created_at', '>=', knex.raw('DATE_SUB(NOW(), INTERVAL 30 DAY)')),
      knex('shop_orders').sum('total as totalRevenue').where('status', '!=', 'cancelled'),
      knex('shop_customers').count('* as totalCustomers'),
      knex('products').count('* as totalProducts'),
      knex('shop_orders').count('* as pendingOrders').where('status', 'pending'),
    ]);

    return {
      totalOrders: totalOrders || 0,
      totalRevenue: totalRevenue || 0,
      totalCustomers: totalCustomers || 0,
      totalProducts: totalProducts || 0,
      pendingOrders: pendingOrders || 0,
    };
  },

  async getRecentOrders(limit = 10) {
    return knex('shop_orders')
      .select('*')
      .orderBy('created_at', 'desc')
      .limit(limit);
  },

  async getOrders(query = {}) {
    let baseQuery = knex('shop_orders').select('*');

    if (query.status) {
      baseQuery = baseQuery.where('status', query.status);
    }

    if (query.startDate) {
      baseQuery = baseQuery.where('created_at', '>=', query.startDate);
    }

    if (query.endDate) {
      baseQuery = baseQuery.where('created_at', '<=', query.endDate);
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const [orders, [{ total }]] = await Promise.all([
      baseQuery.clone().orderBy('created_at', 'desc').limit(limit).offset(offset),
      baseQuery.clone().count('* as total'),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit),
      },
    };
  },

  async updateOrderStatus(orderId, status) {
    return knex('shop_orders')
      .where({ id: orderId })
      .update({ status })
      .returning('*');
  },

  async getProducts(query = {}) {
    let baseQuery = knex('products').select('*');

    if (query.category) {
      baseQuery = baseQuery.where('category_id', query.category);
    }

    if (query.search) {
      baseQuery = baseQuery.where('name', 'like', `%${query.search}%`);
    }

    if (query.inStockOnly) {
      baseQuery = baseQuery.where('stock_quantity', '>', 0);
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const [products, [{ total }]] = await Promise.all([
      baseQuery.clone().orderBy('created_at', 'desc').limit(limit).offset(offset),
      baseQuery.clone().count('* as total'),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit),
      },
    };
  },

  async updateProduct(productId, data) {
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock_quantity !== undefined) updateData.stock_quantity = data.stock_quantity;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;
    if (data.is_online !== undefined) updateData.is_online = data.is_online;

    return knex('products')
      .where({ id: productId })
      .update(updateData)
      .returning('*');
  },

  async getCustomers(query = {}) {
    let baseQuery = knex('shop_customers').select('*');

    if (query.search) {
      baseQuery = baseQuery.where(function() {
        this.where('email', 'like', `%${query.search}%`)
          .orWhere('first_name', 'like', `%${query.search}%`)
          .orWhere('last_name', 'like', `%${query.search}%`);
      });
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const offset = (page - 1) * limit;

    const [customers, [{ total }]] = await Promise.all([
      baseQuery.clone().orderBy('created_at', 'desc').limit(limit).offset(offset),
      baseQuery.clone().count('* as total'),
    ]);

    return {
      customers,
      pagination: {
        page,
        limit,
        total: total || 0,
        pages: Math.ceil((total || 0) / limit),
      },
    };
  },

  async getSalesReport(startDate, endDate) {
    return knex('shop_orders')
      .select(
        knex.raw('DATE(created_at) as date'),
        knex.raw('COUNT(*) as orders'),
        knex.raw('SUM(total) as revenue'),
        knex.raw('SUM(subtotal) as subtotal')
      )
      .where('created_at', '>=', startDate)
      .where('created_at', '<=', endDate)
      .where('status', '!=', 'cancelled')
      .groupBy(knex.raw('DATE(created_at)'))
      .orderBy('date', 'asc');
  },
};
