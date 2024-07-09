import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {

  },
  { timestamps: true }
);

export default mongoose.model("Admin", adminSchema);