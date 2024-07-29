import mongoose from "mongoose";

const adminManageRolesModel = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    companyName: {
      type: String,
    },
    role: {
      type: String,
      enum: ['Admin', "Manager", "User"]
    },
    setPermission: {
      type: String,
      enum: ["Order Management", "Payment Management", "Catalog Management", "User Management", "Report Access"]
    },
  },
  { timestamps: true }
);

export default mongoose.model("AdminManageRoles", adminManageRolesModel);
