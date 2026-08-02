import { paymentRepo } from '../repos/payment.repo.js';
import { checkoutService } from '../checkout/services/checkout.service.js';
import { emailService } from '../email/services/email.service.js';

export const paymentService = {
  async createPaymentIntent(orderNumber, paymentMethod) {
    const order = await checkoutService.getOrder(orderNumber);
    
    // Create payment record
    const [payment] = await paymentRepo.createPayment({
      orderId: order.id,
      amount: order.total,
      currency: 'MAD',
      paymentMethod,
      paymentGateway: 'cod', // Default to COD for now
      gatewayTransactionId: null,
      status: 'pending',
      metadata: { orderNumber },
    });

    return {
      paymentId: payment.id,
      amount: payment.amount,
      currency: payment.currency,
      paymentMethod: payment.payment_method,
      status: payment.status,
      // For COD, no additional processing needed
      requiresAction: false,
    };
  },

  async processPayment(paymentId, paymentData) {
    const payment = await paymentRepo.getPaymentById(paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }

    // For COD, mark as paid immediately (simulated)
    if (payment.payment_method === 'cod') {
      await paymentRepo.updatePaymentStatus(paymentId, 'paid', {
        paidAt: new Date().toISOString(),
      });
      
      // Confirm the order
      await checkoutService.confirmOrder(payment.order_id);
      
      return { success: true, status: 'paid' };
    }

    // For other payment methods, integrate with gateway here
    // This is a placeholder for Stripe, PayPal, etc.
    throw new Error('Payment method not implemented');
  },

  async handleWebhook(gateway, payload, signature) {
    switch (gateway) {
      case 'stripe':
        return this.handleStripeWebhook(payload, signature);
      case 'paypal':
        return this.handlePaypalWebhook(payload, signature);
      default:
        throw new Error('Unsupported payment gateway');
    }
  },

  async handleStripeWebhook(payload, signature) {
    // Placeholder for Stripe webhook handling
    const event = JSON.parse(payload);
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        const payment = await paymentRepo.getPaymentByTransactionId(
          event.data.object.id
        );
        if (payment) {
          await paymentRepo.updatePaymentStatus(payment.id, 'paid', {
            paidAt: new Date().toISOString(),
          });
          await checkoutService.confirmOrder(payment.order_id);
        }
        break;
      case 'payment_intent.failed':
        const failedPayment = await paymentRepo.getPaymentByTransactionId(
          event.data.object.id
        );
        if (failedPayment) {
          await paymentRepo.updatePaymentStatus(failedPayment.id, 'failed', {
            failedAt: new Date().toISOString(),
            error: event.data.object.last_payment_error?.message,
          });
        }
        break;
    }
    
    return { received: true };
  },

  async handlePaypalWebhook(payload, signature) {
    // Placeholder for PayPal webhook handling
    return { received: true };
  },

  async refundPayment(paymentId, amount = null) {
    const payment = await paymentRepo.getPaymentById(paymentId);
    
    if (!payment || payment.status !== 'paid') {
      throw new Error('Payment cannot be refunded');
    }

    // Update payment status to refunded
    await paymentRepo.updatePaymentStatus(paymentId, 'refunded', {
      refundedAt: new Date().toISOString(),
      refundAmount: amount || payment.amount,
    });

    // Cancel the order
    await checkoutService.cancelOrder(payment.order_id);

    // Send refund notification email
    const order = await checkoutService.getOrder(payment.order_id);
    setImmediate(async () => {
      try {
        await emailService.sendOrderCancelled(order);
      } catch (error) {
        console.error('Failed to send refund notification email:', error);
      }
    });

    return { success: true };
  },
};
