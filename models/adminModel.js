import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String
    },
    contactPersonName: {
      type: String
    }, 
    password: {
      type: String
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);