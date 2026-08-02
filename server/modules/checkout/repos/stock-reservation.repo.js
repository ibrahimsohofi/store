import knex from '../../../config/knex.js';

export const stockReservationRepo = {
  async createReservation(orderId, productId, qty, expiryMinutes = 20) {
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    
    return knex('shop_stock_reservations').insert({
      order_id: orderId,
      product_id: productId,
      qty,
      reserved_at: new Date(),
      expires_at: expiresAt,
      status: 'pending',
    });
  },

  async confirmReservation(orderId) {
    return knex('shop_stock_reservations')
      .where({ order_id: orderId, status: 'pending' })
      .update({
        status: 'confirmed',
        confirmed_at: new Date(),
      });
  },

  async cancelReservation(orderId) {
    return knex('shop_stock_reservations')
      .where({ order_id: orderId, status: 'pending' })
      .update({ status: 'cancelled' });
  },

  async expireReservations() {
    const now = new Date();
    return knex('shop_stock_reservations')
      .where('expires_at', '<', now)
      .where('status', 'pending')
      .update({ status: 'expired' });
  },

  async getPendingReservations(productId) {
    return knex('shop_stock_reservations')
      .where({ product_id: productId, status: 'pending' })
      .where('expires_at', '>', new Date())
      .sum('qty as total_reserved')
      .first();
  },

  async getAvailableStock(productId) {
    const product = await knex('products')
      .where({ id: productId })
      .select('stock_quantity')
      .first();
    
    if (!product) return 0;

    const reserved = await this.getPendingReservations(productId);
    const totalReserved = reserved?.total_reserved || 0;

    return Math.max(0, product.stock_quantity - totalReserved);
  },
};
