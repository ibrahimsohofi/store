import nodemailer from 'nodemailer';
import mjml from 'mjml';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const emailService = {
  async sendOrderConfirmation(orderData) {
    try {
      const templatePath = path.join(__dirname, '../templates/order-confirmation.mjml');
      const mjmlTemplate = fs.readFileSync(templatePath, 'utf8');
      
      const template = Handlebars.compile(mjmlTemplate);
      const mjmlContent = template({
        firstName: orderData.shipping_address?.first_name || 'Client',
        orderNumber: orderData.order_number,
        items: orderData.items,
        subtotal: orderData.subtotal?.toFixed(2),
        shipping_cost: orderData.shipping_cost?.toFixed(2),
        vat_amount: orderData.vat_amount?.toFixed(2),
        total: orderData.total?.toFixed(2),
        shippingAddress: orderData.shipping_address,
        orderUrl: `${process.env.SITE_URL}/fr/order-confirmation/${orderData.order_number}`,
      });

      const { html } = mjml(mjmlContent);

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@sohofi.com',
        to: orderData.customer_email || orderData.shipping_address?.email,
        subject: `Confirmation de commande #${orderData.order_number} - SOHOFI BRICO`,
        html,
      });

      console.log(`Order confirmation email sent for order ${orderData.order_number}`);
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      throw error;
    }
  },

  async sendShippingNotification(orderData, trackingNumber) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Votre commande a été expédiée !</h2>
          <p>Bonjour ${orderData.shipping_address?.first_name},</p>
          <p>Votre commande #${orderData.order_number} a été expédiée.</p>
          <p><strong>Numéro de suivi:</strong> ${trackingNumber}</p>
          <p>Livraison estimée: 2-5 jours ouvrables</p>
          <a href="${process.env.SITE_URL}/fr/order-confirmation/${orderData.order_number}" style="background: #10B981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Suivre ma commande
          </a>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@sohofi.com',
        to: orderData.customer_email || orderData.shipping_address?.email,
        subject: `Expédition de votre commande #${orderData.order_number}`,
        html,
      });

      console.log(`Shipping notification email sent for order ${orderData.order_number}`);
    } catch (error) {
      console.error('Failed to send shipping notification email:', error);
      throw error;
    }
  },

  async sendOrderCancelled(orderData) {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Commande annulée</h2>
          <p>Bonjour ${orderData.shipping_address?.first_name},</p>
          <p>Votre commande #${orderData.order_number} a été annulée.</p>
          <p>Si vous n'avez pas demandé cette annulation, veuillez nous contacter.</p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@sohofi.com',
        to: orderData.customer_email || orderData.shipping_address?.email,
        subject: `Annulation de votre commande #${orderData.order_number}`,
        html,
      });

      console.log(`Order cancellation email sent for order ${orderData.order_number}`);
    } catch (error) {
      console.error('Failed to send order cancellation email:', error);
      throw error;
    }
  },
};
