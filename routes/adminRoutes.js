import express from "express";
import {
  adminSignup,
  verifyAdminEmail,
  resendOTP,
  adminLogin,
  adminVerifyPhoneOtp,
  adminGetProfile,
  adminPhoneLogin,
  getAllUsersOnAdmin,
  getAllOrdersOnAdmin,
  getApprovedOrdersOnAdmin,
  logoutAdmin,
  getDeliveredOrdersOnAdmin,
  getActiveOrdersOnAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

router.route("/admin/signup").post(adminSignup);
router.route("/verify/admin/email").post(verifyAdminEmail);
router.route("/resend/admin/otp").post(resendOTP);
router.route("/admin/login").post(adminLogin);
router.route("/admin/phone/login/:adminId").post(adminPhoneLogin);
router.route("/verify/admin/phone/otp").post(adminVerifyPhoneOtp);
router.route("/get/admin/profile/:adminId").get(adminGetProfile);
router.route("/admin/logout").post(logoutAdmin);
router.route("/get-users-on-admin").get(getAllUsersOnAdmin);
router.route("/get-orders-on-admin").get(getAllOrdersOnAdmin);
router.route("/get-approved-orders-on-admin").get(getApprovedOrdersOnAdmin);
router.route("/get-delivered-orders-on-admin").get(getDeliveredOrdersOnAdmin);
router.route("/get-active-orders-on-admin").get(getActiveOrdersOnAdmin);



export default router;
