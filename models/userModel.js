import mongoose from "mongoose";

const userModel = new mongoose.Schema(
  {
    firstName: {
      type: String,
    //   required: true,
    },
    lastName: {
      type: String,
    //   required: true,
    },
    companyName: {
      type: String,
    //   required: true,
    },
    workEmail: {
      type: String,
    //   required: true,
    },
    phone: {
      type: String,
    //   required: true,
    },
    password: {
      type: String,
    },
    confimPassword: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    otp: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userModel);
