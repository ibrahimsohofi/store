import { invoiceService } from '../services/invoice.service.js';
import { checkoutService } from '../checkout/services/checkout.service.js';

export const invoiceController = {
  async getInvoicePdf(req, res) {
    try {
      const { orderNumber } = req.params;
      
      const order = await checkoutService.getOrder(orderNumber);
      
      const pdfBuffer = await invoiceService.generateInvoicePdf(order);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderNumber}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Invoice generation error:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to generate invoice',
        },
      });
    }
  },
};
