import express from "express";
import multer from "multer"
import { addBlog, fetchBlogs } from "../controllers/blogController.js";

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024}
})

const router = express.Router();

router.route("/add/blog").post(upload.single('image'), addBlog);
router.route("/get/all/blogs").get(fetchBlogs);

export default router;