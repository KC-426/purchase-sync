
import express from 'express'

import { requestDemoRegister, phoneLogin, verifyOtp, logoutUser, loginUser, forgotPassword, resetPassword, watchDemoVideo } from '../controllers/userController.js'

const router = express.Router()

router.route('/demo/request/register').post(requestDemoRegister)
router.route('/watch/demo/video/:userId').post(watchDemoVideo)
router.route('/phone/login/:userId').post(phoneLogin)
router.route('/verify/otp').post(verifyOtp)
router.route("/user/login").post(loginUser)
router.route("/forgot/password").post(forgotPassword)
router.route("/reset/password/:token").post(resetPassword)

router.route('/user/logout').post(logoutUser)

export default router