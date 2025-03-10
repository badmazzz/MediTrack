import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";

const updateProductQuantity = async (productId, quantity, order) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Invalid quantity value");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (order) {
    if (product.quantity < quantity) {
      throw new ApiError(400, `Not enough stock available for ${product.name}`);
    }
    product.quantity -= quantity;
  } else {
    product.quantity += quantity;
  }

  await product.save();

  return product;
};

export { updateProductQuantity };
