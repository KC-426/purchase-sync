import express from "express";
import { adminSignup, verifyAdminEmail, resendOTP, adminLogin, adminVerifyPhoneOtp, adminGetProfile, adminPhoneLogin } from "../controllers/adminController.js";

const router = express.Router();

router.route("/admin/signup").post(adminSignup);
router.route("/verify/admin/email").post(verifyAdminEmail);
router.route("/resend/admin/otp").post(resendOTP);
router.route('/admin/login').post(adminLogin)
router.route('/admin/phone/login/:adminId').post(adminPhoneLogin)
router.route('/verify/admin/phone/otp').post(adminVerifyPhoneOtp)
router.route('/get/admin/profile/:adminId').get(adminGetProfile)





export default router;