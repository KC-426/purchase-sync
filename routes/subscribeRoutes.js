import express from "express";

import { addSubscribe } from "../controllers/subscribeController.js";

const router = express.Router();

router.route("/add/user/subscribe").post(addSubscribe);

export default router;