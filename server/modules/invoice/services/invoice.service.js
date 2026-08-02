import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const invoiceService = {
  async generateInvoicePdf(orderData) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header
        doc.fontSize(20).font('Helvetica-Bold').text('SOHOFI BRICO', 50, 50);
        doc.fontSize(10).font('Helvetica').text('Facture', 50, 80);
        doc.text(`N° ${orderData.order_number}`, 50, 95);
        doc.text(`Date: ${new Date(orderData.created_at).toLocaleDateString('fr-FR')}`, 50, 110);

        // Client Info
        doc.fontSize(12).font('Helvetica-Bold').text('Facturé à:', 300, 80);
        doc.fontSize(10).font('Helvetica').text(
          `${orderData.shipping_address?.first_name} ${orderData.shipping_address?.last_name}`,
          300,
          95
        );
        doc.text(orderData.shipping_address?.address_line1 || '', 300, 110);
        doc.text(
          `${orderData.shipping_address?.city}, ${orderData.shipping_address?.postal_code}`,
          300,
          125
        );
        doc.text(orderData.shipping_address?.phone || '', 300, 140);

        // Table Header
        const tableTop = 180;
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('Produit', 50, tableTop);
        doc.text('Qté', 300, tableTop);
        doc.text('Prix unitaire', 380, tableTop);
        doc.text('Total', 480, tableTop);

        // Line
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Table Rows
        doc.fontSize(10).font('Helvetica');
        let y = tableTop + 25;
        
        orderData.items?.forEach((item) => {
          doc.text(item.product_name || item.name, 50, y, { width: 240, ellipsis: true });
          doc.text(item.qty.toString(), 300, y);
          doc.text(`${item.unit_price.toFixed(2)} MAD`, 380, y);
          doc.text(`${(item.unit_price * item.qty).toFixed(2)} MAD`, 480, y);
          y += 20;
        });

        // Totals
        y += 20;
        doc.moveTo(50, y).lineTo(550, y).stroke();
        y += 15;

        doc.font('Helvetica-Bold');
        doc.text('Sous-total:', 380, y);
        doc.text(`${orderData.subtotal?.toFixed(2)} MAD`, 480, y);
        y += 20;

        doc.text('Livraison:', 380, y);
        doc.text(`${orderData.shipping_cost?.toFixed(2)} MAD`, 480, y);
        y += 20;

        doc.text('TVA (20%):', 380, y);
        doc.text(`${orderData.vat_amount?.toFixed(2)} MAD`, 480, y);
        y += 25;

        doc.fontSize(14).text('TOTAL:', 380, y);
        doc.text(`${orderData.total?.toFixed(2)} MAD`, 480, y);

        // Footer
        doc.fontSize(8).font('Helvetica').text(
          'Merci pour votre commande !',
          50,
          750,
          { align: 'center' }
        );
        doc.text(
          'SOHOFI BRICO - Maroc',
          50,
          760,
          { align: 'center' }
        );

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  },

  async saveInvoicePdf(orderData, outputDir) {
    const pdfBuffer = await this.generateInvoicePdf(orderData);
    const filename = `invoice-${orderData.order_number}.pdf`;
    const filepath = path.join(outputDir, filename);
    
    fs.writeFileSync(filepath, pdfBuffer);
    return filepath;
  },
};
