import express from "express";
import { sendVendorApprovalRequest, vendorApprovalOnUserRequest } from "../controllers/orderApprovalController.js";

const router = express.Router();

router.route('/vendor/approval/request').post(sendVendorApprovalRequest)
router.route('/vendor/approval/:orderId').post(vendorApprovalOnUserRequest)




export default router;