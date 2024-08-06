import express from "express";
import {
  consolidatedBillingInvoices,
  createUnpaidInvoice,
  deleteInvoice,
  fetchSingleUnpaidInvoice,
  fetchUnpaidInvoices,
} from "../controllers/paymentInvoiceController.js";

const router = express.Router();

router.route("/create/unpaid/invoice").post(createUnpaidInvoice);
router.route("/fetch/unpaid/invoices").get(fetchUnpaidInvoices);
router.route("/fetch/unpaid/invoice/:invoiceId").get(fetchSingleUnpaidInvoice);
router.route("/delete/invoice/:invoiceId").delete(deleteInvoice);
router.route("/get/consolidated/invoices").get(consolidatedBillingInvoices);



export default router;
