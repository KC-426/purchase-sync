import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      trim: true,
    },
    productCategory: [
      {
        type: String,
        trim: true,
      },
    ],
    stockKeepingUnit: {
      type: String,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    modelNumber: {
      type: String,
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
      unique: true,
    },
    image: [
      {
        name: {
          type: String,
        },
        path: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    regularPrice: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    currency: {
      type: String,
      trim: true,
      default: "USD", // Default to USD
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    colors: [
      {
        type: String,
      },
    ],
    // Shipping Details
    weight: {
      type: String,
      trim: true,
    },
    dimensions: {
      type: String,
      trim: true,
    },
    shippingClass: {
      type: String,
      trim: true,
    },
    handlingTime: {
      type: String,
      trim: true,
    },
    // Inventory Details
    stockQuantity: {
      type: Number,
    },
    minOrderQuantity: {
      type: Number,
    },
    maxOrderQuantity: {
      type: Number,
    },
    reorderLevel: {
      type: Number,
    },
    // Vendor Information
    vendorName: {
      type: String,
      trim: true,
    },
    vendorContact: {
      type: String,
      trim: true,
    },
    // Additional Information
    keywords: {
      type: String,
      trim: true,
    },
    warrantyInformation: {
      type: String,
      trim: true,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
