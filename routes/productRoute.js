import express from "express";
import multer from "multer";
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  fetchProductyId,
  productRating,
  updateProduct,
  updateProductCategory,
  filterProductByVendor,
  filterProductByBrand,
  filterProductByCategory,
  filterProductByColours,
  filterProductByPriceRange,
  fetchProductCategories
} from "../controllers/productController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.route("/add/product").post(upload.array('image'), addProduct);
router.route("/get/products").get(fetchProducts);
router.route("/get/product/:productId").get(fetchProductyId);
router.route("/update/product/:productId").put(upload.array('image'), updateProduct);
router.route("/update/product/category/:productId").put(upload.array('image'), updateProductCategory);
router.route("/delete/product/:productId").delete(deleteProduct);
router.route('/product/rating/:productId').post(productRating)
router.route('/filter-product-by-vendor').get(filterProductByVendor)
router.route('/filter-product-by-brand').get(filterProductByBrand)
router.route('/filter-product-by-category').get(filterProductByCategory)
router.route('/filter-product-by-price-range').get(filterProductByPriceRange)
router.route('/filter-product-by-color').get(filterProductByColours)
router.route('/fetch/product/categories').get(fetchProductCategories)




export default router;