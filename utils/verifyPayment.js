import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config({ path: "config/.env" });

const verifyRazorPay = (order_id, payment_id, razorpay_signature) => {
  const body = `${order_id}|${payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

export default verifyRazorPay;
