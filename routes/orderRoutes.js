import express from "express";
import { createOrder, fetchOrder, fetchAllOrders } from "../controllers/orderController.js";

const router = express.Router();

router.route('/create/order').post(createOrder)
router.route('/fetch/order/:orderId').get(fetchOrder)
router.route('/fetch/all/orders').get(fetchAllOrders)




export default router;