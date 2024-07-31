import express from "express";
import { createOrder, fetchOrder, fetchAllOrders, editOrder, fetchPreviousOrders } from "../controllers/orderController.js";

const router = express.Router();

router.route('/create/order').post(createOrder)
router.route('/fetch/order/:orderId').get(fetchOrder)
router.route('/fetch/all/orders').get(fetchAllOrders)
router.route('/edit/order/:orderId').put(editOrder)
router.route('/get/previous/orders').get(fetchPreviousOrders)







export default router;