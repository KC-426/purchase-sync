import express from "express";
import { getAllOrders, getTotalOrdersCount, logoutVendor, resendOTP, vendorGetProfile, vendorLogin, vendorPhoneLogin, vendorSignup, vendorVerifyPhoneOtp, verifyVendorEmail } from "../controllers/vendorProfileController.js";

const router = express.Router();

router.route("/vendor/signup").post(vendorSignup);
router.route("/verify/vendor/email").post(verifyVendorEmail);
router.route("/resend/vendor/otp").post(resendOTP);
router.route('/vendor/login').post(vendorLogin)
router.route('/vendor/phone/login/:vendorId').post(vendorPhoneLogin)
router.route('/verify/admin/phone/otp').post(vendorVerifyPhoneOtp)
router.route('/get/vendor/profile/:vendorId').get(vendorGetProfile)
router.route('/logout/vendor').post(logoutVendor)
router.route('/get/vendor/orders').get(getAllOrders)
router.route('/get/vendor/orders/count').get(getTotalOrdersCount)







export default router;