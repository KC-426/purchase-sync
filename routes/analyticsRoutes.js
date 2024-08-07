import express from "express";
import {
  fetchTopProducts,
  getTodayOrders,
  newCustomersToday,
  todayTotalSales,
  totalOrdersToday,
  totalProductsSoldToday,
  yearlySales,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.route("/get/today/orders").get(getTodayOrders);
router.route("/get/top/products").get(fetchTopProducts);
router.route("/today/total/sales").get(todayTotalSales);
router.route("/today/total/orders").get(totalOrdersToday);
router.route("/today/total/products/sold").get(totalProductsSoldToday);
router.route("/new/customers/today").get(newCustomersToday);
router.route("/get/yearly/sales").get(yearlySales);


export default router;
