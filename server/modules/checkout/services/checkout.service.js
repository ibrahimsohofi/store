import knex from '../../../config/knex.js';
import { catalogRepo } from '../catalog/repos/catalog.repo.js';
import { cartRepo } from '../cart/repos/cart.repo.js';
import { checkoutRepo } from './repos/checkout.repo.js';
import { stockReservationRepo } from './repos/stock-reservation.repo.js';
import { emailService } from '../email/services/email.service.js';

export const checkoutService = {
  async getQuote(cartToken, customerId, postalCode) {
    const cart = customerId
      ? await cartRepo.getCartByCustomerId(customerId)
      : await cartRepo.getCartByToken(cartToken);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.unit_price * item.qty,
      0
    );

    // Calculate total weight
    const totalWeight = cart.items.reduce(
      (sum, item) => sum + (item.weight_kg || 0) * item.qty,
      0
    );

    // Get shipping quote based on postal code
    let shippingCost = 50; // Default
    let estimatedDays = 5;
    
    if (postalCode) {
      try {
        const { shippingService } = await import('../shipping/services/shipping.service.js');
        const shippingQuote = await shippingService.getShippingQuote(
          postalCode,
          totalWeight,
          subtotal
        );
        shippingCost = shippingQuote.cost;
        estimatedDays = shippingQuote.estimatedDays;
      } catch (error) {
        console.error('Shipping quote error:', error);
        // Fall back to default
      }
    } else if (subtotal >= 600) {
      // Free shipping for orders over 600 MAD
      shippingCost = 0;
    }

    const vatAmount = subtotal * 0.2;
    const total = subtotal + shippingCost + vatAmount;

    return {
      subtotal,
      shippingCost,
      vatAmount,
      total,
      estimatedDays,
      items: cart.items,
    };
  },

  async createOrder(data) {
    const { customerId, cartToken, shippingAddress, billingAddress, paymentMethod, notes } = data;
    
    const cart = customerId
      ? await cartRepo.getCartByCustomerId(customerId)
      : await cartRepo.getCartByToken(cartToken);

    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }

    return await knex.transaction(async (trx) => {
      // Validate stock and create reservations
      for (const item of cart.items) {
        const availableStock = await stockReservationRepo.getAvailableStock(item.product_id);

        if (availableStock < item.qty) {
          throw new Error(`Insufficient stock for product ${item.product_id}. Available: ${availableStock}, Requested: ${item.qty}`);
        }
      }

      // Create shipping address
      const [address] = await trx('shop_addresses').insert({
        first_name: shippingAddress.first_name,
        last_name: shippingAddress.last_name,
        address_line1: shippingAddress.address_line1,
        address_line2: shippingAddress.address_line2 || null,
        city: shippingAddress.city,
        postal_code: shippingAddress.postal_code,
        phone: shippingAddress.phone,
      }).returning('*');

      // Calculate totals
      const subtotal = cart.items.reduce(
        (sum, item) => sum + item.unit_price * item.qty,
        0
      );
      const shippingCost = subtotal >= 600 ? 0 : 50;
      const vatAmount = subtotal * 0.2;
      const total = subtotal + shippingCost + vatAmount;

      // Generate order number
      const orderNumber = await this.generateOrderNumber(trx);

      // Create order
      const [order] = await trx('shop_orders').insert({
        order_number: orderNumber,
        customer_id: customerId || null,
        cart_token: cartToken,
        shipping_address_id: address.id,
        billing_address_id: address.id,
        subtotal,
        shipping_cost: shippingCost,
        vat_amount: vatAmount,
        total,
        payment_method: paymentMethod,
        payment_status: 'pending',
        status: 'pending',
        notes,
      }).returning('*');

      // Create order items, stock reservations, and update stock
      for (const item of cart.items) {
        await trx('shop_order_items').insert({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.name,
          product_sku: item.sku,
          qty: item.qty,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.qty,
        });

        // Create stock reservation (20-minute hold)
        await stockReservationRepo.createReservation(order.id, item.product_id, item.qty, 20);

        // Deduct from actual stock
        await trx('products')
          .where({ id: item.product_id })
          .decrement('stock_quantity', item.qty);
      }

      // Clear cart
      if (customerId) {
        await cartRepo.clearCartByCustomerId(customerId, trx);
      } else {
        await cartRepo.clearCartByToken(cartToken, trx);
      }
// Send order confirmation email (fire and forget)
      setImmediate(async () => {
        try {
          const orderWithItems = await this.getOrder(order.order_number);
          await emailService.sendOrderConfirmation(orderWithItems);
        } catch (error) {
          console.error('Failed to send order confirmation email:', error);
        }
      });

      
      return order;
    });
  },

  async confirmOrder(orderId) {
    return await knex.transaction(async (trx) => {
      // Confirm stock reservations
      await stockReservationRepo.confirmReservation(orderId);

      // Update order status
      await trx('shop_orders')
        .where({ id: orderId })
        .update({ status: 'processing', payment_status: 'paid' });

      return await checkoutRepo.getOrderById(orderId);
    });
  },

  async cancelOrder(orderId) {
    return await knex.transaction(async (trx) => {
      // Get order items
      const items = await checkoutRepo.getOrderItems(orderId);

      // Cancel reservations and restore stock
      for (const item of items) {
        await stockReservationRepo.cancelReservation(orderId);
        await trx('products')
          .where({ id: item.product_id })
          .increment('stock_quantity', item.qty);
      }

      // Update order status
      await trx('shop_orders')
        .where({ id: orderId })
        .update({ status: 'cancelled', payment_status: 'cancelled' });

      return await checkoutRepo.getOrderById(orderId);
    });
  },

  async getOrder(orderNumber) {
    const order = await checkoutRepo.getOrderByNumber(orderNumber);
    if (!order) {
      throw new Error('Order not found');
    }
    const items = await checkoutRepo.getOrderItems(order.id);
    return { ...order, items };
  },

  async generateOrderNumber(trx) {
    const today = new Date();
    const prefix = `SOH${today.getFullYear().toString().slice(-2)}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    
    const [{ count }] = await trx('shop_orders')
      .where('order_number', 'like', `${prefix}%`)
      .count('* as count')
      .first();
    
    const sequence = String(parseInt(count || 0) + 1).padStart(4, '0');
    return `${prefix}${sequence}`;
    return `SOH${year}${month}${day}${random}`;
  },
};
