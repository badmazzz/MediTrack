import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { updateProductQuantity } from "../utils/updateProductQuantity.js";

const createOrder = asyncHandler(async (req, res) => {
  const { products, totalAmount, shippingAddress } = req.body;
  const userId = req.user._id;
  let finalShippingAddress = shippingAddress;

  if (!shippingAddress) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    finalShippingAddress = user.address;
  }

  if (!Array.isArray(products) || products.length === 0) {
    throw new ApiError(400, "Products array is required and cannot be empty");
  }

  const productIds = products.map((item) => item.product);
  const productDetails = await Product.find({ _id: { $in: productIds } });

  if (productDetails.length !== products.length) {
    throw new ApiError(400, "One or more products not found");
  }

  let updatedProducts = [];
  let calculatedTotalAmount = 0;

  for (const item of products) {
    const product = productDetails.find(
      (p) => p._id.toString() === item.product
    );

    if (product.quantity < item.quantity) {
      throw new ApiError(400, `Not enough stock available for ${product.name}`);
    }

    const productPrice = product.price;
    console.log(item.product);
    await updateProductQuantity(item.product, item.quantity, true);

    updatedProducts.push({
      product: item.product,
      quantity: item.quantity,
      price: productPrice,
    });

    calculatedTotalAmount += productPrice * item.quantity;
  }

  // Convert totalAmount to Number before comparison
  if (Number(calculatedTotalAmount) !== Number(totalAmount)) {
    throw new ApiError(400, "Total amount mismatch");
  }

  // Create and save order
  const order = new Order({
    user: userId,
    products: updatedProducts,
    totalAmount: calculatedTotalAmount,
    shippingAddress: finalShippingAddress,
  });

  const createdOrder = await order.save();
  if (!createdOrder) {
    throw new ApiError(400, "Order creation failed");
  }

  res
    .status(201)
    .json(new ApiResponse(201, createdOrder, "Order created successfully"));
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  if (userRole !== "admin" && order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to cancel this order");
  }

  if (order.status === "cancelled") {
    throw new ApiError(400, "Order is already cancelled");
  }
  if (order.status === "delivered") {
    throw new ApiError(400, "Cannot cancel a delivered order");
  }

  if (order.status === "shipped" || order.status === "pending") {
    for (const item of order.products) {
      console.log(item.product);
      await updateProductQuantity(item.product, item.quantity, false);
    }
  }

  order.status = "cancelled";
  await order.save();

  if (order.paymentStatus === "paid") {
    console.log("Payment refund initiated for order:", order._id);
  }

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

const deleteCancelledOrder = asyncHandler(async (req, res) => {
  const deletedOrders = await Order.deleteMany({ status: "cancelled" });
  if (deletedOrders.deletedCount === 0) {
    throw new ApiError(404, "No cancelled orders found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "Cancelled orders deleted successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { paymentStatus } = req.body;

  const validPaymentStatuses = ["pending", "paid", "failed"];
  if (!validPaymentStatuses.includes(paymentStatus)) {
    throw new ApiError(400, "Invalid payment status");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    { paymentStatus },
    { new: true }
  );
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, order, "Payment status updated successfully"));
});

const orderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;
  const userRole = req.user.role;

  const order = await Order.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(orderId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo", //Use if you want to get product details
    },
    {
      $project: {
        _id: 1,
        user: 1,
        status: 1,
        paymentStatus: 1,
        shippingAddress: 1,
        totalAmount: 1,
        products: {
          product: 1,
          quantity: "$products.quantity",
          price: "$products.price",
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        status: { $first: "$status" },
        paymentStatus: { $first: "$paymentStatus" },
        shippingAddress: { $first: "$shippingAddress" },
        totalAmount: { $first: "$totalAmount" },
        products: { $push: "$products" },
      },
    },
  ]);
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (userRole !== "admin" && order.user.toString() !== userId.toString()) {
    throw new ApiError(403, "You are not authorized to view this order");
  }

  res.status(200).json(new ApiResponse(200, order, "Order details"));
});

const allOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $unwind: "$products",
    },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    {
      $unwind: "$productInfo", //Use if you want to get product details
    },
    {
      $project: {
        _id: 1,
        user: 1,
        status: 1,
        paymentStatus: 1,
        shippingAddress: 1,
        totalAmount: 1,
        products: {
          product: 1,
          quantity: "$products.quantity",
          price: "$products.price",
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        user: { $first: "$user" },
        status: { $first: "$status" },
        paymentStatus: { $first: "$paymentStatus" },
        shippingAddress: { $first: "$shippingAddress" },
        totalAmount: { $first: "$totalAmount" },
        products: { $push: "$products" },
      },
    },
  ]);
  if (!orders) {
    throw new ApiError(404, "No orders found");
  }

  res.status(200).json(new ApiResponse(200, orders, "All orders"));
});

const updatedProducts = asyncHandler(async (req, res) => { });

export {
  createOrder,
  cancelOrder,
  deleteCancelledOrder,
  updateOrderStatus,
  updatePaymentStatus,
  orderDetails,
  allOrders,
};
