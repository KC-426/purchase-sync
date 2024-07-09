import express from "express";
import {
  getUserRequest,
  createUserRequest,
} from "../controllers/userRequestController.js";

const router = express.Router();

router.route("/add/user/request").post(createUserRequest);
router.route("/get/user/request").get(getUserRequest);

export default router;