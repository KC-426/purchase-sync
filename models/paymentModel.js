import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentInvoice",
      required: true,
    },
    payment_id: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
    },
    razorpay_signature: {
      type: String,
      // required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["payment due", "payment done"],
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
