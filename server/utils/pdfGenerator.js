import PDFDocument from 'pdfkit';

// PayMint brand colors
const COLORS = {
  primary: '#0CA6AC',    // Teal
  secondary: '#2D3748',  // Dark gray
  accent: '#4A5568',     // Medium gray
  light: '#718096',      // Light gray
  white: '#FFFFFF'
};

export const generateInvoicePDF = async (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        info: {
          Title: `Invoice ${invoice.invoiceNumber}`,
          Author: 'PayMint',
          Subject: 'Invoice'
        }
      });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Header with PayMint branding
      doc
        .fillColor(COLORS.primary)
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('PayMint', 50, 50)
        .moveDown(0.5);

      // Invoice title
      doc
        .fillColor(COLORS.secondary)
        .fontSize(20)
        .text('INVOICE', { align: 'right' })
        .moveDown();

      // Invoice details in a modern layout
      doc
        .fillColor(COLORS.accent)
        .fontSize(12)
        .text(`Invoice Number: ${invoice.invoiceNumber}`, { align: 'right' })
        .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, { align: 'right' })
        .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, { align: 'right' })
        .moveDown(2);

      // From section (Sender's details)
      doc
        .fillColor(COLORS.secondary)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('From:', 50, doc.y)
        .moveDown(0.5);

      const fromY = doc.y;
      doc
        .fillColor(COLORS.accent)
        .fontSize(12)
        .font('Helvetica')
        .text(invoice.user.name)
        .text(invoice.user.company || '')
        .text(invoice.user.email)
        .text(invoice.user.address || '')
        .text(invoice.user.phone || '')
        .moveDown(2);

      // Bill To section (Client details)
      doc
        .fillColor(COLORS.secondary)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Bill To:', 300, fromY)
        .moveDown(0.5);

      doc
        .fillColor(COLORS.accent)
        .fontSize(12)
        .font('Helvetica')
        .text(invoice.client.name, { continued: false, align: 'right' })
        .text(invoice.client.company || '', { continued: false, align: 'right' })
        .text(invoice.client.email, { continued: false, align: 'right' })
        .text(invoice.client.address || '', { continued: false, align: 'right' })
        .text(invoice.client.phone || '', { continued: false, align: 'right' })
        .moveDown(2);

      // Items table with modern styling
      const tableTop = doc.y;
      const tableLeft = 50;
      const col1 = tableLeft;
      const col2 = col1 + 250;
      const col3 = col2 + 100;
      const col4 = col3 + 100;

      // Table header with background
      doc
        .fillColor(COLORS.primary)
        .rect(tableLeft, tableTop, 500, 25)
        .fill();

      doc
        .fillColor(COLORS.white)
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Description', col1 + 10, tableTop + 5, { width: 200 })
        .text('Quantity', col2, tableTop + 5, { width: 50, align: 'right' })
        .text('Rate', col3, tableTop + 5, { width: 50, align: 'right' })
        .text('Amount', col4, tableTop + 5, { width: 50, align: 'right' });

      // Table rows with alternating colors
      let y = tableTop + 25;
      invoice.items.forEach((item, index) => {
        // Alternate row colors
        if (index % 2 === 0) {
          doc
            .fillColor('#F7FAFC')
            .rect(tableLeft, y, 500, 25)
            .fill();
        }

        doc
          .fillColor(COLORS.accent)
          .fontSize(10)
          .text(item.title, col1 + 10, y + 5, { width: 200 })
          .text(item.quantity.toString(), col2, y + 5, { width: 50, align: 'right' })
          .text(`$${item.rate.toFixed(2)}`, col3, y + 5, { width: 50, align: 'right' })
          .text(`$${item.amount.toFixed(2)}`, col4, y + 5, { width: 50, align: 'right' });
        y += 25;
      });

      // Add a line after the items table
      doc
        .strokeColor(COLORS.light)
        .lineWidth(1)
        .moveTo(tableLeft, y)
        .lineTo(tableLeft + 500, y)
        .stroke();

      // Totals section with modern styling
      y += 20; // Add more space after the line
      
      // Create a container for totals
      const totalsWidth = 200;
      const totalsLeft = col4 - totalsWidth + 50;
      
      // Subtotal
      doc
        .fillColor(COLORS.secondary)
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Subtotal:', totalsLeft, y, { width: 100, align: 'right' })
        .text(`$${invoice.subtotal.toFixed(2)}`, totalsLeft + 110, y, { width: 90, align: 'right' });
      
      y += 25; // Consistent spacing between totals
      
      // Tax
      doc
        .text(`Tax (${invoice.taxRate}%):`, totalsLeft, y, { width: 100, align: 'right' })
        .text(`$${invoice.taxAmount.toFixed(2)}`, totalsLeft + 110, y, { width: 90, align: 'right' });
      
      y += 25; // Consistent spacing between totals
      
      // Add a line before total
      doc
        .strokeColor(COLORS.light)
        .lineWidth(1)
        .moveTo(totalsLeft, y)
        .lineTo(totalsLeft + 200, y)
        .stroke();
      
      y += 20; // Space after the line
      
      // Total
      doc
        .fillColor(COLORS.primary)
        .fontSize(14)
        .text('Total:', totalsLeft, y, { width: 100, align: 'right' })
        .text(`$${invoice.total.toFixed(2)}`, totalsLeft + 110, y, { width: 90, align: 'right' });

      // Notes section with modern styling
      if (invoice.notes) {
        y += 40;
        doc
          .fillColor(COLORS.secondary)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('Notes:', tableLeft, y)
          .moveDown(0.5);

        doc
          .fillColor(COLORS.accent)
          .fontSize(10)
          .font('Helvetica')
          .text(invoice.notes, { width: 500 });
      }

      // Footer with PayMint branding
      const footerText = 'Thank you for your business!';
      const footerY = 750;
      
      doc
        .fillColor(COLORS.primary)
        .fontSize(10)
        .text('PayMint', 50, footerY, { align: 'left' })
        .text(footerText, 0, footerY, { align: 'center' })
        .text(`Invoice #${invoice.invoiceNumber}`, 0, footerY, { align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}; 
