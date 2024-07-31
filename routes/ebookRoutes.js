import express from "express";
import multer from "multer";
import { addEbook, fetchEbooks } from "../controllers/ebookController.js";

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024}
})

const router = express.Router();

router.route("/add/ebook").post(upload.single('ebook'), addEbook);
router.route("/get/all/ebooks").get(fetchEbooks);

export default router;