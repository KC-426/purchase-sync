import crypto from "crypto";

const order_id = '66aa4851f146732cf2279fa5'; 
const payment_id = 'pay_29QQoUBi66xm2f';
const secret = '8iPAGPJ6ZYm6z3MroGw0rlB4z'; 

const generateSignature = (order_id, payment_id, secretKey) => {
  const body = `${order_id}|${payment_id}`;
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(body)
    .digest('hex');
  return expectedSignature;
};

const razorpay_signature = generateSignature(order_id, payment_id, secret);

console.log('Order ID:', order_id);
console.log('Payment ID:', payment_id);
console.log('Generated Razorpay Signature:', razorpay_signature);
