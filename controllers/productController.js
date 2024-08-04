import productModel from "../models/productModel.js";
import {
  uploadImagesToFirebaseStorage,
  deleteImagesFromFirebaseStorage,
} from "../utils/helperFuntions.js";

export const addProduct = async (req, res) => {
  try {
    const {
      productName,
      productCategory,
      modelNumber,
      stockKeepingUnit,
      description,
      brand,
      barcode,
      regularPrice,
      salePrice,
      currency,
      colors,
      weight,
      dimensions,
      shippingClass,
      handlingTime,
      stockQuantity,
      minOrderQuantity,
      maxOrderQuantity,
      reorderLevel,
      vendorName,
      vendorContact,
      keywords,
      warrantyInformation,
    } = req.body;

    if (
      !productName ||
      !productCategory ||
      !modelNumber ||
      !stockKeepingUnit ||
      !description ||
      !brand ||
      !barcode ||
      !regularPrice ||
      !salePrice ||
      !currency
    ) {
      return res
        .status(400)
        .json({ message: "Please fill the required fields!" });
    }

    if (regularPrice < salePrice) {
      return res
        .status(400)
        .json({ message: "Sale price must be smaller than regular price!" });
    }

    const imageFiles = req.files;
    if (!imageFiles || imageFiles.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required." });
    }

    const uploadedImages = await uploadImagesToFirebaseStorage(req, res);

    const product = new productModel({
      productName,
      productCategory,
      modelNumber,
      stockKeepingUnit,
      description,
      brand,
      barcode,
      regularPrice,
      salePrice,
      currency,
      colors,
      image: uploadedImages,
      weight,
      dimensions,
      shippingClass,
      handlingTime,
      stockQuantity,
      minOrderQuantity,
      maxOrderQuantity,
      reorderLevel,
      vendorName,
      vendorContact,
      keywords,
      warrantyInformation,
    });

    const result = await product.save();
    res.status(201).json({ message: "Product added successfully!", result });
  } catch (err) {
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyPattern)[0];
      const duplicatedValue = err.keyValue[duplicatedField];
      return res.status(400).json({
        message: `Duplicate key error: ${duplicatedField} '${duplicatedValue}' already exists!`,
      });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const fetchProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    if (!products) {
      return res.status(404).json({ message: "No product found !" });
    }

    res
      .status(200)
      .json({ message: "Products fetched successfully !", products });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const fetchProductyId = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "No product found !" });
    }

    res
      .status(200)
      .json({ message: "Products fetched successfully !", product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const updatedData = req.body;

    if (!updatedData) {
      return res.status(400).json({ message: "No data provided for update!" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    if (req.files && req.files.length > 0) {
      if (product.image && product.image.length > 0) {
        await deleteImagesFromFirebaseStorage(product.image);
      }

      const uploadedImages = await uploadImagesToFirebaseStorage(req, res);
      product.image = uploadedImages;
    }

    product.productName = updatedData.productName || product.productName;
    product.productCategory =
      updatedData.productCategory || product.productCategory;
    product.modelNumber = updatedData.modelNumber || product.modelNumber;
    product.stockKeepingUnit =
      updatedData.stockKeepingUnit || product.stockKeepingUnit;
    product.description = updatedData.description || product.description;
    product.brand = updatedData.brand || product.brand;
    product.barcode = updatedData.barcode || product.barcode;
    product.regularPrice = updatedData.regularPrice || product.regularPrice;
    product.salePrice = updatedData.salePrice || product.salePrice;
    product.currency = updatedData.currency || product.currency;
    product.colors = updatedData.colors || product.colors;
    product.weight = updatedData.weight || product.weight;
    product.dimensions = updatedData.dimensions || product.dimensions;
    product.shippingClass = updatedData.shippingClass || product.shippingClass;
    product.handlingTime = updatedData.handlingTime || product.handlingTime;
    product.stockQuantity = updatedData.stockQuantity || product.stockQuantity;
    product.minOrderQuantity =
      updatedData.minOrderQuantity || product.minOrderQuantity;
    product.maxOrderQuantity =
      updatedData.maxOrderQuantity || product.maxOrderQuantity;
    product.reorderLevel = updatedData.reorderLevel || product.reorderLevel;
    product.vendorName = updatedData.vendorName || product.vendorName;
    product.vendorContact = updatedData.vendorContact || product.vendorContact;
    product.keywords = updatedData.keywords || product.keywords;
    product.warrantyInformation =
      updatedData.warrantyInformation || product.warrantyInformation;

    await product.save();

    res.status(200).json({ message: "Product updated successfully!", product });
  } catch (err) {
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyPattern)[0];
      const duplicatedValue = err.keyValue[duplicatedField];
      return res.status(400).json({
        message: `Duplicate key error: ${duplicatedField} '${duplicatedValue}' already exists!`,
      });
    }
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "No product found !" });
    }

    if (product.image && product.image.length > 0) {
      await deleteImagesFromFirebaseStorage(product.image);
    }

    await productModel.findByIdAndDelete(productId);

    res.status(200).json({ message: "Product deleted successfully !" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const updateProductCategory = async (req, res) => {
  const { productId } = req.params;

  try {
    const updatedData = req.body;

    if (!updatedData) {
      return res.status(400).json({ message: "No data provided for update!" });
    }

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    if (product.image && product.image.length > 0) {
      await deleteImagesFromFirebaseStorage(product.image);
    }

    const uploadedImages = await uploadImagesToFirebaseStorage(req, res);

    product.image = uploadedImages;
    product.productName = updatedData.productName || product.productName;
    product.productCategory =
      updatedData.productCategory || product.productCategory;
    product.description = updatedData.description || product.description;
    product.brand = updatedData.brand || product.brand;
    product.colors = updatedData.colors || product.colors;
    product.currency = updatedData.currency || product.currency;

    await product.save();

    res
      .status(200)
      .json({ message: "Product category updated successfully!", product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const productRating = async (req, res) => {
  const { productId } = req.params;
  try {
    const { rating } = req.body;
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5." });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    product.rating = rating;
    await product.save();

    res
      .status(200)
      .json({ message: "Product rating updated successfully!", product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const filterProductByVendor = async (req, res) => {
  try {
    const { search = "" } = req.query;
    console.log(req.query);

    if (search == "") {
      const products = await productModel.find().sort({ createdAt: -1 });
      return res.status(200).json({ message: "Products feteched !", products });
    }

    let productData = [];

    let vendorNameSearch = await productModel
      .find({
        vendorName: {
          $regex: search,
          $options: "i",
        },
      })
      .sort({ createdAt: -1 });

    if (vendorNameSearch.length > 0) {
      for (let vendor of vendorNameSearch) {
        productData.push(vendor);
      }
    }

    res.status(200).json({
      message: "Product by vendor fetched successfully!",
      productData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const filterProductByBrand = async (req, res) => {
  try {
    const { search = "" } = req.query;
    console.log(req.query);

    if (search == "") {
      const products = await productModel.find().sort({ createdAt: -1 });
      return res.status(200).json({ message: "Products feteched !", products });
    }

    let productData = [];
    let productBrand = await productModel
      .find({
        brand: {
          $regex: search,
          $options: "i",
        },
      })
      .sort({ createdAt: -1 });

    if (productBrand.length > 0) {
      for (let brand of productBrand) {
        productData.push(brand);
      }
    }

    res.status(200).json({
      message: "Product by vendor fetched successfully!",
      productData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const filterProductByCategory = async (req, res) => {
  try {
    const { search = "" } = req.query;

    if (search == "") {
      const products = await productModel.find().sort({ createdAt: -1 });
      return res.status(200).json({ message: "Products feteched !", products });
    }

    let productData = [];
    let categorySearch = await productModel
      .find({
        productCategory: {
          $regex: search,
          $options: "i",
        },
      })
      .sort({ createdAt: -1 });
    console.log(categorySearch);

    if (categorySearch.length > 0) {
      for (let category of categorySearch) {
        productData.push(category);
      }
    }
    console.log("line 389", productData);

    res.status(200).json({
      message: "Product by category fetched successfully!",
      productData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const filterProductByPriceRange = async (req, res) => {
  try {
    const { minPrice = 0, maxPrice = Infinity } = req.query;

    const products = await productModel
      .find({
        regularPrice: { $gte: minPrice, $lte: maxPrice },
      })
      .sort({ createdAt: -1 });

    if (!products) {
      return res
        .status(404)
        .json({ message: "No products found in this price range !" });
    }

    return res.status(200).json({ message: "Products fetched!", products });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const filterProductByColours = async (req, res) => {
  try {
    const { search = "" } = req.query;

    if (search == "") {
      const products = await productModel.find().sort({ createdAt: -1 });
      return res.status(200).json({ message: "Products feteched !", products });
    }

    let productData = [];
    let colorSearch = await productModel
      .find({
        colors: {
          $regex: search,
          $options: "i",
        },
      })
      .sort({ createdAt: -1 });

    if (colorSearch.length > 0) {
      for (let color of colorSearch) {
        productData.push(color);
      }
    }

    res.status(200).json({
      message: "Product by color fetched successfully!",
      productData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const fetchProductCategories = async (req, res) => {
  try {
    const products = await productModel.find({}, "productCategory");
    const categories = new Set();

    products.forEach((product) => {
      product.productCategory.forEach((category) => {
        categories.add(category);
      });
    });

    const uniqueCategories = Array.from(categories);
    console.log(uniqueCategories);

    res.status(200).json({
      message: "Product categories fetched successfully!",
      categories: uniqueCategories,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const getFrequentlyOrderedProducts = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .sort({ orderCount: -1 })
      .limit(10);
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error!" });
  }
};
