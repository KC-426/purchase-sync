import cartModel from "../models/cartModel.js";
import productModel from "../models/productModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await cartModel.findOne({ userId });

    if (!cart) {
      cart = new cartModel({ userId, items: [] });
    } else if (!Array.isArray(cart.items)) {
      cart.items = [];
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1 });
    }

    await cart.save();

    res
      .status(200)
      .json({ message: "Product added to cart successfully", cart });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const fetchCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const cartProducts = await cartModel
      .findById(cartId)
      .populate("items.productId");
    if (!cartProducts) {
      return res
        .status(404)
        .json({ message: "No product in your cart, please add a product !" });
    }

    res
      .status(200)
      .json({ message: "Cart Products fetched successfully", cartProducts });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};

export const deleteProductFromCart = async (req, res) => {
  try {
    const { cartId, productId } = req.params;
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "No cart found !" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "No product in your cart!" });
    }


    if (cart.items[itemIndex].quantity > 1) {
      // Decrement the quantity by 1
      cart.items[itemIndex].quantity -= 1;
    } else {
      // If quantity is 1, remove the item from the cart
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();

    res
      .status(200)
      .json({ message: "Cart Products fetched successfully", cart });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error!" });
  }
};
