import orderApproval from "../models/orderApprovalRoute.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import nodemailer from "nodemailer"
import vendorStockModel from "../models/vendorStockModel.js";

export const sendVendorApprovalRequest = async (req, res) => {
    const { orderId } = req.body;
  
    try {
      // Find the order by orderId
      const order = await orderModel.findById(orderId).populate("productId");
      if (!order) {
        return res.status(404).json({ message: "No order found!" });
      }
      console.log(order);
  
      // Find the product associated with the order
      const product = await productModel.findById(order.productId._id);
      if (!product) {
        return res.status(404).json({ message: "No product found!" });
      }
      console.log(product);
  
      // Extract vendor information from the product
      const vendorContact = product.vendorContact;
      if (!vendorContact) {
        return res
          .status(404)
          .json({ message: "No vendor contact found for the product!" });
      }

      const approval = new orderApproval({ orderId })

      await approval.save()
  
      // Parse vendor contact details
      const [contactPersonName, email, phone] = vendorContact.split(", ");
  
      // Send email to the vendor for order approval
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_PASS },
      });
  
      const info = await transporter.sendMail({
        from: `"Your Company" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Order Approval Request",
        text: `Hello ${contactPersonName},\n\nPlease approve the order with ID: ${orderId} for the product: ${product.productName}.\n\nOrder Details:\n- Quantity: ${order.quantity}\n- Price: ${order.price}\n- Location: ${order.location}\n- Cost Center: ${order.costCenter}\n\nThank you.`,
        html: `Hello ${contactPersonName},<br><br>Please approve the order with ID: <strong>${orderId}</strong> for the product: <strong>${product.productName}</strong>.<br><br><strong>Order Details:</strong><br>- Quantity: ${order.quantity}<br>- Price: ${order.price}<br>- Location: ${order.location}<br>- Cost Center: ${order.costCenter}<br><br>Thank you.`,
      });
  
      console.log("Message sent: %s", info.messageId);
  
      res.status(201).json({
        success: true,
        message: "Order approval request sent to vendor successfully",
        order,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };
  

  export const vendorApprovalOnUserRequest = async (req, res) => {
       const { orderId } = req.params
    try {
      const order = await orderModel.findById(orderId).populate('productId')
      
      let orderedProductName = order.productId.productName
      
      const vendorStockQuantity = await vendorStockModel.findOne({ productName: orderedProductName })
      // console.log(vendorStockQuantity)

      if (!vendorStockQuantity) {
        return res.status(404).json({ message: "Vendor stock not found for the product" });
      }
      
      if(vendorStockQuantity.vendorStock > order.quantity) {
         order.orderStatus = "approved"
      } else {
        order.orderStatus = "rejected"; 
      }
      console.log(order)

      await order.save()
  
      res.status(201).json({
        success: true,
        message: "Order approved by vendor successfully",
        order,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error!" });
    }
  };