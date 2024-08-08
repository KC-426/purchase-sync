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
  getShippedOrdersOnAdmin,
  getPendingOrdersOnAdmin,
  getActiveProductsOnAdmin,
  getOutOfStockProductsOnAdmin,
  newCustomersYearlyOnAdmin,
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
router.route("/get-users-admin").get(getAllUsersOnAdmin);
router.route("/get-orders-admin").get(getAllOrdersOnAdmin);
router.route("/get-pending-orders-admin").get(getPendingOrdersOnAdmin);
router.route("/get-approved-orders-admin").get(getApprovedOrdersOnAdmin);
router.route("/get-shipped-orders-admin").get(getShippedOrdersOnAdmin);
router.route("/get-delivered-orders-admin").get(getDeliveredOrdersOnAdmin);
router.route("/get-active-orders-admin").get(getActiveProductsOnAdmin);
router
  .route("/get-out-of-stock-orders-admin")
  .get(getOutOfStockProductsOnAdmin);
router.route("/get-new-customers-admin").get(newCustomersYearlyOnAdmin);


export default router;
