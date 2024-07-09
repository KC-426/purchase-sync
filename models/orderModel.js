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
      approval: {
        type: String,
        enum: ['approve', 'reject']
      },
      status: {
        type: String
      }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
