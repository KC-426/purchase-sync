import userModel from "../models/userModel.js";
import twilio from "twilio";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const client = twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

const generateOTP = () => {
  let digits = "0123456789";
  let OTP = "";
  let len = digits.length;
  for (let i = 0; i < 4; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }
  return OTP;
};

export const requestDemoRegister = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      companyName,
      workEmail,
      phoneNumber,
      preferredDate,
      preferredTime,
    } = req.body;

    const newDemoRequest = new userModel({
      firstName,
      lastName,
      companyName,
      workEmail,
      phoneNumber,
      preferredDate,
      preferredTime,
    });

    const result = await newDemoRequest.save();
    return res.status(201).json({
      message: "Thank you for your demo request! We will contact you soon.",
      result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const watchDemoVideo = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    const { workEmail, averageMonthlySpend, vendorsOrderedFrom } = req.body;

    if (!workEmail || !averageMonthlySpend || !vendorsOrderedFrom) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    user.workEmail = workEmail; 
    user.averageMonthlySpend = averageMonthlySpend;
    user.vendorsOrderedFrom = vendorsOrderedFrom;

    const result = await user.save();

    return res.status(201).json({
      message: "Thank you for your interest! You can now watch the demo video.",
      result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


export const phoneLogin = async (req, res) => {
  const { userId } = req.params;
  try {
    const findUser = await userModel.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: "User not found!" });
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
    findUser.phone = formattedPhone;
    findUser.otp = otp;
    await findUser.save();

    return res
      .status(200)
      .json({ message: "OTP sent successfully!", findUser });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    if (!otp) {
      return res.status(400).json({ message: "OTP required" });
    }

    const verifyOtp = await userModel.findOne({ otp });
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

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ workEmail: email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, please register !" });
    }

    if (user.password) {
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return res.status(400).json({ message: "Password not match! " });
      }
    } else {
      const hashedPwd = await bcrypt.hash(password, 12);
      user.password = hashedPwd;
      await user.save();
    }

    const token = jwt.sign(
      { _id: user._id, email: user.workEmail },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "login successfull !", user, token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ workEmail: email });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 3600000; // 1 hour expiry

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    const resetUrl = `http://localhost:3000/api/v1/reset/password/${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
    });

    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) have requested a password reset. Please click on the link to reset your password: ${resetUrl}`,
      html: `<p>You are receiving this email because you (or someone else) have requested a password reset. Please click on the link to reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    console.log("Message sent: %s", info.messageId);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    const user = await userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token!" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });

    res.status(200).json({ message: "logout successfull !" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
