import express from "express";
import { createVendorStock } from "../controllers/vendorStockController.js";

const router = express.Router();

router.route("/create/vendor/stock").post(createVendorStock);

export default router;
