import adminModel from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });
import { generateOTP } from "../utils/helperFuntions.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import vendorprofileModel from "../models/vendorprofileModel.js";
import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js"

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
let otpTimestamp = {};

export const adminSignup = async (req, res) => {
    try {
      const { contactPersonName, email, password } = req.body;
  
      const findAdmin = await adminModel.findOne({ email });
      if (findAdmin) {
        return res.status(400).json({
          message: "Admin already exists, please enter another email!",
        });
      }
  
      const hashedPwd = await bcrypt.hash(password, 12);
  
      const otp = generateOTP();
      otpTimestamp[email] = new Date();
  
      const newAdmin = new adminModel({
        contactPersonName,
        email,
        password: hashedPwd,
        otp,
      });
  
      const result = await newAdmin.save();
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
      });
  
      const info = await transporter.sendMail({
        from: `"Your Name" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Email Verification",
        text: `Hello ${contactPersonName}, Please verify your OTP.`,
        html: `Hello ${contactPersonName}, This is your OTP ${otp} for email verification, please verify it.`,
      });
  
      console.log("Message sent: %s", info.messageId);
  
      res.status(200).json({ message: "Signup successful!", result });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };
  
export const verifyAdminEmail = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const admin = await adminModel.findOne({ email, otp });
    if (!admin) {
      return res.status(400).json({ message: "Incorrect OTP!" });
    }

    admin.otp = null;
    await admin.save();

    res.status(200).json({ message: "Email verification successful!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const resendOTP = async (req, res) => {
    try {
      const { email } = req.body;
  
      const admin = await adminModel.findOne({ email });
      if (!admin) {
        return res.status(404).json({ message: "Admin not found!" });
      }
  
      const currentTime = new Date();
      const previousOtpTime = otpTimestamp[email];
  
      if (previousOtpTime && currentTime - previousOtpTime < 59000) {
        return res.status(400).json({ message: "You can only request a new OTP after 59 seconds." });
      }
  
      const otp = generateOTP();
      admin.otp = otp;
      otpTimestamp[email] = currentTime;
  
      await admin.save();
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
      });
  
      const info = await transporter.sendMail({
        from: `"Your Name" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Email Verification",
        text: `Hello ${admin.contactPersonName}, Please verify your OTP.`,
        html: `Hello ${admin.contactPersonName}, This is your OTP ${otp} for email verification, please verify it.`,
      });
  
      console.log("Message sent: %s", info.messageId);
  
      res.status(200).json({ message: "OTP sent successfully!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };
  
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findAdmin = await adminModel.findOne({ email });
    if (!findAdmin) {
      return res.status(404).json({
        message: "Admin not found, please sign up !",
      });
    }

    const isMatchpassword = await bcrypt.compare(password, findAdmin.password);
    if (!isMatchpassword) {
      return res.status(400).json({
        message: "Incorrect Password!",
      });
    }

    const token = jwt.sign(
      { _id: findAdmin._id, email: findAdmin.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Login successfull !", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const adminPhoneLogin = async (req, res) => {
    const { adminId } = req.params;
    try {
      const findAdmin = await adminModel.findById(adminId);
      if (!findAdmin) {
        return res.status(404).json({ message: "Admin not found!" });
      }
  
      let { phone } = req.body;
  
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required" });
      }
  
      if (!phone.startsWith("+")) {
        phone = `+91${phone}`;
      }
  
      const phoneNumberObject = parsePhoneNumberFromString(phone);
      if (!phoneNumberObject || !phoneNumberObject.isValid()) {
        return res.status(400).json({ message: "Invalid phone number format" });
      }
  
      const formattedPhone = phoneNumberObject.format("E.164");
  
      // Generate OTP
      const otp = generateOTP();
  
      // Send OTP via SMS using Twilio
      await client.messages.create({
        body: `Your verification OTP code is ${otp}`,
        from: process.env.PHONE_NUMBER,
        to: formattedPhone,
      });
  
      // Update user document with phone and otp
      findAdmin.phone = formattedPhone;
      findAdmin.otp = otp;
      await findAdmin.save();
  
      return res.status(200).json({ message: "OTP sent successfully!", findAdmin });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };
  
export const adminVerifyPhoneOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const verifyOtp = await adminModel.findOne({ otp });
    if (!verifyOtp) {
      return res.status(400).json({ message: "Invalid otp !" });
    }

    verifyOtp.otp = null;
    await verifyOtp.save();

    res.status(200).json({ message: "Verification successfull !" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const adminGetProfile = async (req, res) => {
  try {
    const { adminId } = req.params;
    const adminProfile = await adminModel.findById(adminId);

    if (!adminProfile) {
      return res.status(404).json({ message: "Admin profile not found !" });
    }

    res
      .status(200)
      .json({ message: "Fetched profile successfully !", adminProfile });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};



export const getAllUsersOnAdmin = async (req, res) => {
  try {
    const users = await userModel.find();

    if (!users) {
      return res.status(404).json({ message: "No user found !" });
    }

    res
      .status(200)
      .json({ message: "All users fetched successfully !", users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


export const getAllOrdersOnAdmin = async (req, res) => {
  try {
    const orders = await orderModel.find().populate(['userId', 'productId'])

    if (!orders) {
      return res.status(404).json({ message: "No order found !" });
    }

    res
      .status(200)
      .json({ message: "All orders fetched successfully !", orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


export const getApprovedOrdersOnAdmin = async (req, res) => {
  try {
    const approvedOrders = await orderModel.find({ orderStatus: "approved" }).populate(['userId', 'productId'])

    if (!approvedOrders) {
      return res.status(404).json({ message: "No approved order found !" });
    }

    res
      .status(200)
      .json({ message: "All orders fetched successfully !", approvedOrders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};