import knex from '../../../config/knex.js';

export const paymentRepo = {
  async createPayment(data) {
    return knex('shop_payments').insert({
      order_id: data.orderId,
      amount: data.amount,
      currency: data.currency || 'MAD',
      payment_method: data.paymentMethod,
      payment_gateway: data.paymentGateway,
      gateway_transaction_id: data.gatewayTransactionId,
      status: data.status || 'pending',
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    }).returning('*');
  },

  async getPaymentById(id) {
    return knex('shop_payments').where({ id }).first();
  },

  async getPaymentByOrderId(orderId) {
    return knex('shop_payments').where({ order_id: orderId }).first();
  },

  async getPaymentByTransactionId(transactionId) {
    return knex('shop_payments').where({ gateway_transaction_id: transactionId }).first();
  },

  async updatePaymentStatus(id, status, metadata = null) {
    const updateData = { status };
    if (metadata) {
      updateData.metadata = JSON.stringify(metadata);
    }
    return knex('shop_payments')
      .where({ id })
      .update(updateData)
      .returning('*');
  },

  async updatePaymentByTransactionId(transactionId, status, metadata = null) {
    const updateData = { status };
    if (metadata) {
      updateData.metadata = JSON.stringify(metadata);
    }
    return knex('shop_payments')
      .where({ gateway_transaction_id: transactionId })
      .update(updateData)
      .returning('*');
  },
};
