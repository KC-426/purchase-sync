import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config({ path: "config/.env" });

const PORT = process.env.PORT || 3000;
const { MONGODB_URI } = process.env;

app.use(express.json({ limit: "5000mb" }));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());

import userRouter from "./routes/userRoutes.js"
import userSubscribeRoute from "./routes/subscribeRoutes.js"
import productRoute from "./routes/productRoute.js";
import vendorProfileRoute from "./routes/vendorProfileRoute.js"
import adminRoute from "./routes/adminRoutes.js"
import userRequestRoute from "./routes/userRequestRoute.js"
import cartRoute from "./routes/cartRoutes.js"
import orderRoute from "./routes/orderRoutes.js"
import orderApprovalRoute from "./routes/orderApprovalRoutes.js";
import vendorStockRoute from "./routes/vendorStockRoutes.js"
import adminManageRolesRoute from "./routes/adminManageRolesRoutes.js";


app.use('/api/v1', userRouter)
app.use('/api/v1', userSubscribeRoute)
app.use('/api/v1', productRoute)
app.use('/api/v1', vendorProfileRoute)
app.use('/api/v1', adminRoute)
app.use("/api/v1", userRequestRoute)
app.use("/api/v1", cartRoute)
app.use("/api/v1", orderRoute)
app.use("/api/v1", orderApprovalRoute)
app.use("/api/v1", vendorStockRoute)
app.use("/api/v1", adminManageRolesRoute)



// app.use("/", (req, res) => {
//   console.log("Working ");
//   res.send("WORKING");
// });

mongoose
  .connect(MONGODB_URI)
  .then(() => {
  console.log('DB connected')
  })
  .catch((err) => console.log(err));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });