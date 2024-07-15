import vendorStockModel from "../models/vendorStockModel.js";

export const createVendorStock = async (req, res) => {
  try {
    const { productName, vendorStock } = req.body;

    const findProduct = await vendorStockModel.findOne({productName});
    if (findProduct) {
      return res.status(400).json({ message: "Product already exist" });
    }

    const stock = new vendorStockModel({
      productName,
      vendorStock,
    });
    const result = await stock.save();
    res.status(201).json({ message: "Stock saved successfully", result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
