import knex from '../../../config/knex.js';

export const cartRepo = {
  async getCartByToken(token) {
    return knex('shop_carts')
      .where({ token })
      .where('expires_at', '>', new Date())
      .first();
  },

  async getCartByCustomerId(customerId) {
    return knex('shop_carts')
      .where({ customer_id: customerId })
      .where('expires_at', '>', new Date())
      .first();
  },

  async createCart(data) {
    const [cart] = await knex('shop_carts')
      .insert({
        ...data,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return cart;
  },

  async updateCart(id, data) {
    const [cart] = await knex('shop_carts')
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');
    return cart;
  },

  async getCartItems(cartId) {
    return knex('shop_cart_items')
      .where({ cart_id: cartId })
      .select('*');
  },

  async addCartItem(data) {
    const [item] = await knex('shop_cart_items')
      .insert({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    return item;
  },

  async updateCartItem(id, data) {
    const [item] = await knex('shop_cart_items')
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');
    return item;
  },

  async removeCartItem(id) {
    return knex('shop_cart_items')
      .where({ id })
      .del();
  },

  async clearCart(cartId) {
    return knex('shop_cart_items')
      .where({ cart_id: cartId })
      .del();
  },

  async getCartItem(cartId, productId) {
    return knex('shop_cart_items')
      .where({ cart_id: cartId, product_id: productId })
      .first();
  },
};
