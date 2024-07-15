import mongoose from "mongoose";

const  vendorStockSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
    },
    vendorStock: {
      type: Number,
      trim: true,
    }

  },
  { timestamps: true }
);

export default mongoose.model("VendorStock", vendorStockSchema);
