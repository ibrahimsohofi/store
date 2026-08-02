import knex from '../../../config/knex.js';

export const checkoutRepo = {
  async createOrder(data) {
    const [order] = await knex('shop_orders')
      .insert({
        ...data,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return order;
  },

  async getOrderById(id) {
    return knex('shop_orders')
      .where({ id })
      .first();
  },

  async getOrderByNumber(orderNumber) {
    return knex('shop_orders')
      .where({ order_number: orderNumber })
      .first();
  },

  async updateOrder(id, data) {
    const [order] = await knex('shop_orders')
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');
    return order;
  },

  async createOrderItem(data) {
    const [item] = await knex('shop_order_items')
      .insert({
        ...data,
        created_at: new Date(),
      })
      .returning('*');
    return item;
  },

  async getOrderItems(orderId) {
    return knex('shop_order_items')
      .where({ order_id: orderId })
      .select('*');
  },

  async hasCustomerPurchasedProduct(customerId, productId) {
    const result = await knex('shop_order_items as oi')
      .join('shop_orders as o', 'oi.order_id', 'o.id')
      .where('o.customer_id', customerId)
      .where('oi.product_id', productId)
      .where('o.status', '!=', 'cancelled')
      .first();

    return !!result;
  },

  async createAddress(data) {
    const [address] = await knex('shop_addresses')
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return address;
  },

  async getAddressById(id) {
    return knex('shop_addresses')
      .where({ id })
      .first();
  },

  async getCustomerAddresses(customerId) {
    return knex('shop_addresses')
      .where({ customer_id: customerId })
      .select('*');
  },
};
