import vendorprofileModel from "../models/vendorprofileModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });
import { generateOTP } from "../utils/helperFuntions.js";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import orderModel from "../models/orderModel.js";

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
let otpTimestamp = {};

export const vendorSignup = async (req, res) => {
  try {
    const {
      companyName,
      contactPersonName,
      email,
      password,
      address,
      region,
      city,
      state,
      country,
      pincode,
    } = req.body;

    const findVendor = await vendorprofileModel.findOne({ email });
    if (findVendor) {
      return res.status(400).json({
        message: "Vendor already exists, please enter another email!",
      });
    }

    const hashedPwd = await bcrypt.hash(password, 12);

    const otp = generateOTP();
    otpTimestamp[email] = new Date();

    const newVendor = new vendorprofileModel({
      companyName,
      contactPersonName,
      email,
      password: hashedPwd,
      address,
      region,
      city,
      state,
      country,
      pincode,
      otp,
    });

    const result = await newVendor.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Email verification",
      text: `Hello ${contactPersonName}, Please verify OTP.`,
      html: `Hello ${contactPersonName}, This is your OTP ${otp} for email verification, please verify it.`,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ message: "Signup successful!", result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const verifyVendorEmail = async (req, res) => {
  try {
    const { otp, email } = req.body;

    const vendor = await vendorprofileModel.findOne({ email, otp });
    if (!vendor) {
      return res.status(400).json({ message: "Incorrect OTP!" });
    }

    vendor.otp = null;
    await vendor.save();

    res.status(200).json({ message: "Email verification successful!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const vendor = await vendorprofileModel.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found!" });
    }

    const currentTime = new Date();
    const previousOtpTime = otpTimestamp[email];

    if (previousOtpTime && currentTime - previousOtpTime < 59000) {
      return res
        .status(400)
        .json({ message: "You can only request a new OTP after 59 seconds." });
    }

    const otp = generateOTP();
    vendor.otp = otp;
    otpTimestamp[email] = currentTime;

    await vendor.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Email Verification",
      text: `Hello ${vendor.contactPersonName}, Please verify OTP.`,
      html: `Hello ${vendor.contactPersonName}, This is your OTP ${otp} for email verification, please verify it.`,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findVendor = await vendorprofileModel.findOne({ email });
    if (!findVendor) {
      return res.status(404).json({
        message: "Vendor not found, please sign up !",
      });
    }

    const isMatchpassword = await bcrypt.compare(password, findVendor.password);
    if (!isMatchpassword) {
      return res.status(400).json({
        message: "Incorrect Password!",
      });
    }

    const token = jwt.sign(
      { _id: findVendor._id, email: findVendor.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "login successfull !", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const vendorPhoneLogin = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const findVendor = await vendorprofileModel.findById(vendorId);
    if (!findVendor) {
      return res.status(404).json({ message: "Vendor not found!" });
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
    findVendor.phone = formattedPhone;
    findVendor.otp = otp;
    await findVendor.save();

    return res
      .status(200)
      .json({ message: "OTP sent successfully!", findVendor });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const vendorVerifyPhoneOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const verifyOtp = await vendorprofileModel.findOne({ otp });
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

export const vendorGetProfile = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const vendorProfile = await vendorprofileModel.findById(vendorId);
    if (!vendorProfile) {
      return res.status(404).json({ message: "Vendor profile not found !" });
    }

    res
      .status(200)
      .json({ message: "Fetched profile successfully !", vendorProfile });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


export const logoutVendor = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "logout successfull !" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


export const getAllOrders = async (req, res) => {
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
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getTotalOrdersCount = async (req, res) => {
  try {
    const orders = await orderModel.find().countDocuments()
    if (!orders) {
      return res.status(404).json({ message: "No order found !" });
    }

    res
      .status(200)
      .json({ message: "All orders count fetched successfully !", orders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


// export const latestOrders = async (req, res) => {
//   try {

//     res
//       .status(200)
//       .json({ message: "All orders fetched successfully !" });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Internal server error!" });
//   }
// };
