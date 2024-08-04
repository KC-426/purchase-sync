import Razorpay from "razorpay";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import nodemailer from "nodemailer";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const { userId, productId, quantity, location, costCenter } = req.body;

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
      quantity,
      orderId: order.id,
      orderStatus: "approval required",
      location,
      costCenter,
      price,
    });

    await orderData.save();

    product.orderCount += 1;
    await product.save();

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
    const order = await orderModel
      .findById(orderId)
      .populate(["productId", "userId"]);
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
    const orders = await orderModel.find().populate(["productId", "userId"]);
    if (!orders) {
      return res.status(404).json({ message: "No Order found!" });
    }

    res.status(200).json({
      success: true,
      message: "All Orders fetched successfully",
      orders,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const editOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const updatedData = req.body;
    const order = await orderModel
      .findById(orderId)
      .populate(["productId", "userId"]);
    if (!order) {
      return res.status(404).json({ message: "No Order found!" });
    }

    order.productId = updatedData.productId || order.productId;
    order.quantity = updatedData.quantity || order.quantity;
    order.location = updatedData.location || order.location;
    order.costCenter = updatedData.costCenter || order.costCenter;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const fetchPreviousOrders = async (req, res) => {
  try {
    const prevOrders = await orderModel
      .find({ orderStatus: ["delivered", "approved", "intransit"] })
      .populate(["productId", "userId"]);
    if (!prevOrders) {
      return res.status(404).json({ message: "No Previous Orders found!" });
    }

    res.status(200).json({
      success: true,
      message: "All Previous Orders fetched successfully",
      prevOrders,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};


export const updateTracking = async (req, res) => {
  try {
    const { orderId, tracking } = req.body;

    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "No order found" });
    }

    tracking.forEach(track => {
      const { orderStatus, location } = track;
      if (orderStatus && location) {
        order.tracking.push({ orderStatus, location });
      }
    });

    const latestTracking = tracking[tracking.length - 1];
    if (latestTracking) {
      order.orderStatus = latestTracking.orderStatus;
    }

    await order.save();



    return res.status(200).json({
      success: true,
      message: "Order tracking updated successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const fetchTracking = async (req, res) => {
  const { orderId } = req.params
  try {
   const order = await orderModel.findById(orderId)
   if(!order) {
    return res.status(404).json({ message: "No order found !"})
   }

   res.status(200).json({ tracking: order.tracking });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};