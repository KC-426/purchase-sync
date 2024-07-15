import mongoose from "mongoose";

const orderApprovalSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("OrderApproval", orderApprovalSchema);
