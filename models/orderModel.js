import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    orderStatus: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
    },
  },
  { _id: false } 
);

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
    quantity: {
      type: Number,
    },
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "approval required",
        "approved",
        "rejected",
        "delivered",
        "intransit",
        "shipped",
        "pending"     
      ],
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
    tracking: [trackingSchema],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
