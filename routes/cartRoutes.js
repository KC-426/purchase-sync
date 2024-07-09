import express from "express";
import { addToCart, deleteProductFromCart, fetchCart } from "../controllers/cartController.js";

const router = express.Router();

router.route('/add-product-to-cart/:productId').post(addToCart)
router.route('/get/cart/products/:cartId').get(fetchCart)
router.route('/delete/cart/products/:cartId/:productId').delete(deleteProductFromCart)



export default router;