import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import paymentInvoiceModel from "../models/paymentInvoiceModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

// Resolve __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createUnpaidInvoice = async (req, res) => {
  const { orderId, userId, dueDate, reward } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const order = await orderModel.findById(orderId);
    console.log(order);
    if (!order) {
      return res.status(404).json({ message: "Order not found!" });
    }

    const totalAmount = order.price * order.quantity;

    const newPayment = new paymentInvoiceModel({
      orderId,
      amount: totalAmount,
      productId: order.productId,
      userId,
      dueDate,
      reward,
      status: "payment due",
    });

    await newPayment.save();

    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const fileName = `invoice_${newPayment._id}.pdf`;
    const filePath = path.join(uploadsDir, fileName);

    const doc = new PDFDocument({ margin: 50 });
    doc
      .pipe(fs.createWriteStream(filePath))
      .on("finish", () => {
        res.status(201).json({
          success: true,
          message: "Unpaid invoice created successfully",
          payment: newPayment,
          pdfUrl: filePath,
        });
      })
      .on("error", (error) => {
        console.error("Error writing PDF file:", error);
        res.status(500).json({ message: "Error writing PDF file!" });
      });

    // Title
    doc.fontSize(25).fillColor("#0000FF").text("Unpaid Invoice", {
      align: "center",
    });

    // Invoice details
    doc
      .moveDown()
      .fontSize(16)
      .fillColor("#000000")
      .text(`Invoice ID: ${newPayment._id}`, { align: "left" });

    // Draw a line
    doc
      .moveDown()
      .strokeColor("#AAAAAA")
      .lineWidth(1)
      .moveTo(doc.x, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();

    doc
      .moveDown(0.5)
      .fontSize(14)
      .text(`Order ID: ${newPayment.orderId}`, { align: "left" })
      .text(`User ID: ${newPayment.userId}`, { align: "left" })
      .text(`Product ID: ${newPayment.productId}`, { align: "left" })
      .text(`Amount: $${newPayment.amount}`, { align: "left" })
      .text(`Due Date: ${newPayment.dueDate.toDateString()}`, { align: "left" })
      .text(`Reward: ${newPayment.reward}`, { align: "left" })
      .text(`Status: ${newPayment.status}`, { align: "left" })
      .text(`Issue Date: ${newPayment.issueDate.toDateString()}`, {
        align: "left",
      });

    doc.end();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const fetchUnpaidInvoices = async (req, res) => {
  try {
    const unpaidInvoices = await paymentInvoiceModel.find();
    if (!unpaidInvoices || unpaidInvoices.length === 0) {
      return res.status(404).json({ message: "No unpaid invoice found " });
    }

    res.status(200).json({
      message: "Unpaid invoices fetched successfully !",
      unpaidInvoices,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const fetchSingleUnpaidInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const unpaidInvoice = await paymentInvoiceModel.findById(invoiceId);
    if (!unpaidInvoice || unpaidInvoice.length === 0) {
      return res.status(404).json({ message: "No unpaid invoice found " });
    }

    res.status(200).json({
      message: "Unpaid invoice fetched successfully  !",
      unpaidInvoice,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const deleteInvoice = async (req, res) => {
  const { invoiceId } = req.params;
  try {
    const invoice = await paymentInvoiceModel.findById(invoiceId);
    if (!invoice || invoice.length === 0) {
      return res.status(404).json({ message: "No invoice found " });
    }

    await paymentInvoiceModel.findByIdAndDelete(invoiceId);

    res.status(200).json({
      message: "Invoice deleted successfully  !",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const consolidatedBillingInvoices = async (req, res) => {
  try {
    const invoices = await paymentInvoiceModel
      .find()
      .populate(["userId", "productId"]);
    if (!invoices || invoices.length === 0) {
      return res.status(404).json({ message: "No invoice found " });
    }

    res.status(200).json({
      message: "Invoice fetched successfully  !",
      invoices,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const consolidatedSingleBillingInvoice = async (req, res) => {
  const { invoiceId } = req.params
  try {
    const invoice = await paymentInvoiceModel
      .findById(invoiceId)
      .populate(["userId", "productId"]);
    if (!invoice || invoice.length === 0) {
      return res.status(404).json({ message: "No invoice found " });
    }

    res.status(200).json({
      message: "Invoice fetched successfully  !",
      invoice,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};