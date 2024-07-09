import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      trim: true,
    },
    contactPersonName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    otp: {
      type: String,
    },
    phone: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vendor", vendorSchema);
