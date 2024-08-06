import Order from "../models/orderModel.js";
import productModel from "../models/productModel.js";

export const getTodayOrders = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0); // Set time to 00:00:00:000

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999); // Set time to 23:59:59:999

    // Find orders created today
    const dayWiseOrders = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });
    res.status(200).json({
      message: "Today orders fetched successfully!",
      orders: dayWiseOrders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const fetchTopProducts = async (req, res) => {
  try {
    const topProducts = await productModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      message: "Top Products fetched successfully!",
      topProducts,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
