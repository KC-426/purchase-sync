import Order from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import moment from "moment"
import Product from "../models/productModel.js";

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

/////////////////////////////////////////////      REPORTING      //////////////////////////////////////////

export const todayTotalSales = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const totalSales = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$quantity", "$price"] } },
        },
      },
    ]);

    const totalSalesAmount = totalSales.length > 0 ? totalSales[0].total : 0;

    res.status(200).json({
      message: "Today's total sales fetched successfully!",
      totalSales: `$${(totalSalesAmount / 1000).toFixed(1)}k`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const totalOrdersToday = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });
    const ordersCount = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    }).countDocuments();

    res.status(200).json({
      message: "Today Total Orders fetched successfully!",
      ordersCount,
      orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const totalProductsSoldToday = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const totalQuantity = orders.reduce(
      (sum, order) => sum + order.quantity,
      0
    );

    res.status(200).json({
      message: "Today Total Sold Products fetched successfully!",
      totalQuantity,
      orders,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const newCustomersToday = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const users = await userModel.find({
      createdAt: { $gte: startOfToday, $lte: endOfToday },
    });

    const usersCount = await userModel
      .find({
        createdAt: { $gte: startOfToday, $lte: endOfToday },
      })
      .countDocuments();

    res.status(200).json({
      message: "Today Total Users fetched successfully!",
      usersCount,
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};


export const yearlySales = async (req, res) => {
  try {
    const startOfYear = moment().startOf('year').toDate();
    const endOfYear = moment().endOf('year').toDate();

    const monthlySalesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear, $lte: endOfYear }
        }
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          quantity: { $toDouble: '$quantity' },
          price: { $toDouble: '$price' },
          productId: 1
        }
      },
      {
        $group: {
          _id: { month: '$month' },
          totalSales: { $sum: { $multiply: ['$quantity', '$price'] } },
          totalOrders: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          bestsellers: { $push: { productId: '$productId', quantity: '$quantity' } }
        }
      },
      {
        $sort: { '_id.month': 1 }
      }
    ]);

    // Determine the bestsellers for each month and fetch their details
    const monthlyDataWithBestsellers = await Promise.all(monthlySalesData.map(async (month) => {
      const productCounts = {};
      month.bestsellers.forEach(order => {
        if (order.productId) {
          productCounts[order.productId] = (productCounts[order.productId] || 0) + order.quantity;
        }
      });

      const bestsellerId = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a])[0];

      // Fetch only the vendorName and vendorContact fields
      const bestsellerDetails = bestsellerId
        ? await Product.findById(bestsellerId).select('vendorName vendorContact').lean().exec()
        : null;

      return {
        month: month._id.month,
        totalSales: month.totalSales,
        totalOrders: month.totalOrders,
        totalQuantity: month.totalQuantity,
        bestsellers: bestsellerDetails
      };
    }));

    res.status(200).json({
      message: "Yearly sales data fetched successfully!",
      data: monthlyDataWithBestsellers
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error!" });
  }
}