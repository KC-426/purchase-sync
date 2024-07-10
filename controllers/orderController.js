import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const { userId, productId, location, costCenter } = req.body;

  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "No user found!" });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "No product found!" });
    }

    const price = product.regularPrice;

    // Create Razorpay order
    const options = {
      amount: price * 100, // Razorpay amount is in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    console.log(order);

    const orderData = new orderModel({
      userId: user._id,
      productId,
      orderId: order.id,
      orderStatus: 'approval required',
      location,
      costCenter,
      price,
    });

    await orderData.save();

    res.status(201).json({
      success: true,
      message: "Razorpay order created successfully",
      orderData,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


export const fetchOrder = async (req, res) => {
    const { orderId } = req.params;
  
    try {
      const order = await orderModel.findById(orderId).populate(['productId', "userId"])
      if (!order) {
        return res.status(404).json({ message: "No Order found!" });
      }
  
      res.status(201).json({
        success: true,
        message: "Order fetched successfully",
        order,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };

  export const fetchAllOrders = async (req, res) => {  
    try {
      const orders = await orderModel.find().populate(['productId', "userId"])
      if (!orders) {
        return res.status(404).json({ message: "No Order found!" });
      }
  
      res.status(201).json({
        success: true,
        message: "All Orders fetched successfully",
        orders,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };
  