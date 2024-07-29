import express from "express";
import { createOrder, fetchOrder, fetchAllOrders, editOrder } from "../controllers/orderController.js";

const router = express.Router();

router.route('/create/order').post(createOrder)
router.route('/fetch/order/:orderId').get(fetchOrder)
router.route('/fetch/all/orders').get(fetchAllOrders)
router.route('/edit/order/:orderId').put(editOrder)






export default router;