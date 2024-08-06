import express from "express";
import {
  fetchTopProducts,
  getTodayOrders,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.route("/get/today/orders").get(getTodayOrders);
router.route("/get/top/products").get(fetchTopProducts);

export default router;
