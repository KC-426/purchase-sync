import express from "express";
import { fetchPaidInvoices, paymentDone } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/make/payment").post(paymentDone);
router.route("/get/paid/invoices").get(fetchPaidInvoices);


export default router;
