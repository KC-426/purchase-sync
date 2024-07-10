import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    orderId: {
      type: String,
    },
    // userApproval: {
    //   type: String,
    //   enum: ['approve', 'reject'],
    // },
    orderStatus: {
      type: String,
      enum: ['approval required', 'approved', 'rejected'],
    },
    location: {
      type: String,
    },
    costCenter: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
