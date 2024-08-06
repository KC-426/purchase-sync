import mongoose from "mongoose";

const paymentInvoiceSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
    },
    amount: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    status: {
      type: String,
      enum: ["payment due", "payment done"],
      default: "payment due", 
    },
    issueDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    reward: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PaymentInvoice", paymentInvoiceSchema);
