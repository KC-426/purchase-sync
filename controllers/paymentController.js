import paymentModel from "../models/paymentModel.js";
import verifyRazorPay from "../utils/verifyPayment.js";
import paymentInvoiceModel from "../models/paymentInvoiceModel.js";
import generateInvoice from "../utils/generateInvoice.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const paymentDone = async (req, res) => {
  try {
    const { order_id, payment_id, razorpay_signature } = req.body;

    if (!order_id || !razorpay_signature || !payment_id) {
      return res
        .status(400)
        .json({ message: "Please fill the required fields!" });
    }

    const invoice = await paymentInvoiceModel.findOne({ orderId: order_id });
    if (!invoice) {
      return res.status(404).json({ message: "No invoice found!" });
    }

    const isVerified = verifyRazorPay(
      invoice.orderId,
      payment_id,
      razorpay_signature
    );

    if (!isVerified) {
      return res.status(400).json({ message: "Payment verification failed!" });
    }

    invoice.status = "payment done";
    await invoice.save();

    const payment = new paymentModel({
      invoiceId: invoice._id,
      payment_id,
      amount: invoice.amount,
      productId: invoice.productId,
      userId: invoice.userId,
      productId: invoice.productId,
      status: "payment done",
    });

    await payment.save();

    // Generate the invoice PDF
    const invoiceData = {
      invoiceId: invoice._id,
      userId: invoice.userId,
      productId: invoice.productId,
      amount: invoice.amount,
      status: invoice.status,
    };

    const filePath = path.join(
      __dirname,
      "..",
      "invoices",
      `${invoice._id}.pdf`
    );
    await generateInvoice(invoiceData, filePath);

    res.status(200).json({
      message: "Payment successful and invoice updated!",
      payment,
      invoicePath: filePath,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const fetchPaidInvoices = async (req, res) => {
  try {
    const paidInvoices = await paymentModel
      .find({ status: "payment done" })
      .populate(["userId", "productId"]);
    if (!paidInvoices || !paidInvoices.length) {
      return res.status(404).json({ length: "No paid invoice found !" });
    }
    res
      .status(200)
      .json({ message: "Paid invoice fetched successfull !", paidInvoices });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
