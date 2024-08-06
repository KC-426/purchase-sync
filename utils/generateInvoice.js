import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const generateInvoice = (invoiceData, filePath) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Add content to the PDF
      doc.fontSize(20).text('Paid Invoice', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Invoice ID: ${invoiceData.invoiceId}`);
      doc.text(`User ID: ${invoiceData.userId}`);
      doc.text(`Product ID: ${invoiceData.productId}`);
      doc.text(`Amount: ${invoiceData.amount}`);
      doc.text(`Status: ${invoiceData.status}`);
      doc.text(`Date: ${new Date().toLocaleString()}`);
      
      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default generateInvoice;
