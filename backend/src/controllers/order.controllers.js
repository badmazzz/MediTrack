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

  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

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

const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, paymentStatus } = req.body;

  // Validate status if provided
  if (status) {
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new ApiError(400, "Invalid order status");
    }
  }

  // Validate payment status if provided
  if (paymentStatus) {
    const validPaymentStatuses = ["pending", "paid", "failed"];
    if (!validPaymentStatuses.includes(paymentStatus)) {
      throw new ApiError(400, "Invalid payment status");
    }
  }

  const updateFields = {};
  if (status) updateFields.status = status;
  if (paymentStatus) updateFields.paymentStatus = paymentStatus;

  if (Object.keys(updateFields).length === 0) {
    throw new ApiError(400, "No valid fields provided for update");
  }

  if (status === "cancelled") {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, "Order not found");
    }
    for (const item of order.products) {
      await updateProductQuantity(item.product, item.quantity, false);
    }
    if (order.paymentStatus === "paid") {
      console.log("Payment refund initiated for order:", order._id);
    }
    if (order.status === "delivered") {
      throw new ApiError(400, "Cannot cancel a delivered order");
    }
  }

  const order = await Order.findByIdAndUpdate(orderId, updateFields, {
    new: true,
  }).populate("products.product");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, order, "Order updated successfully"));
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
      $unwind: "$productInfo",
    },
    {
      $project: {
        _id: 1,
        user: 1,
        status: 1,
        paymentStatus: 1,
        shippingAddress: 1,
        totalAmount: 1,
        createdAt: {
          $dateToString: { format: "%d-%m-%Y", date: "$createdAt" },
        },
        products: {
          product: "$products.product",
          quantity: "$products.quantity",
          price: "$products.price",
          name: "$productInfo.name",
          image: "$productInfo.productImage",
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
        createdAt: { $first: "$createdAt" },
        products: { $push: "$products" },
      },
    },
  ]);
  if (!orders) {
    throw new ApiError(404, "No orders found");
  }

  res.status(200).json(new ApiResponse(200, orders, "All orders"));
});

const totalSell = asyncHandler(async (req, res) => {
  const totalSell = await Order.aggregate([
    {
      $match: {
        status: "delivered",
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: "$totalAmount" },
      },
    },
  ]);

  console.log(totalSell);

  if (!totalSell) {
    throw new ApiError(404, "No sales found");
  }

  res.status(200).json(new ApiResponse(200, totalSell, "Total sales"));
});

const totalOrders = asyncHandler(async (req, res) => {
  const totalOrders = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  if (!totalOrders) {
    throw new ApiError(404, "No orders found");
  }

  res.status(200).json(new ApiResponse(200, totalOrders, "Total orders"));
});

const totalOrdersByStatus = asyncHandler(async (req, res) => {
  const totalOrdersByStatus = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  if (!totalOrdersByStatus) {
    throw new ApiError(404, "No orders found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, totalOrdersByStatus, "Total orders by status"));
});

const totalOrdersByPaymentStatus = asyncHandler(async (req, res) => {
  const totalOrdersByPaymentStatus = await Order.aggregate([
    {
      $group: {
        _id: "$paymentStatus",
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  if (!totalOrdersByPaymentStatus) {
    throw new ApiError(404, "No orders found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        totalOrdersByPaymentStatus,
        "Total orders by payment status"
      )
    );
});

const totalOrdersByUser = asyncHandler(async (req, res) => {
  const totalOrdersByUser = await Order.aggregate([
    {
      $group: {
        _id: "$user",
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  if (!totalOrdersByUser) {
    throw new ApiError(404, "No orders found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, totalOrdersByUser, "Total orders by user"));
});

const totalOrdersByProduct = asyncHandler(async (req, res) => {
  const totalOrdersByProduct = await Order.aggregate([
    {
      $unwind: "$products",
    },
    {
      $group: {
        _id: "$products.product",
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  if (!totalOrdersByProduct) {
    throw new ApiError(404, "No orders found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, totalOrdersByProduct, "Total orders by product")
    );
});

const totalOrdersByDate = asyncHandler(async (req, res) => {
  const totalOrdersByDate = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  if (!totalOrdersByDate) {
    throw new ApiError(404, "No orders found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, totalOrdersByDate, "Total orders by date"));
});

const totalOrdersByMonth = asyncHandler(async (req, res) => {
  const totalOrdersByMonth = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  if (!totalOrdersByMonth) {
    throw new ApiError(404, "No orders found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, totalOrdersByMonth, "Total orders by month"));
});

const totalOrdersByYear = asyncHandler(async (req, res) => {
  const totalOrdersByYear = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y", date: "$createdAt" } },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  if (!totalOrdersByYear) {
    throw new ApiError(404, "No orders found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, totalOrdersByYear, "Total orders by year"));
});

const fetchAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("products.product", "name price");

  if (!orders) {
    throw new ApiError(404, "No orders found");
  }

  res.status(200).json(new ApiResponse(200, orders, "All orders"));
};

export {
  createOrder,
  cancelOrder,
  deleteCancelledOrder,
  updateOrder,
  orderDetails,
  allOrders,
  totalSell,
  totalOrders,
  totalOrdersByStatus,
  totalOrdersByPaymentStatus,
  totalOrdersByUser,
  totalOrdersByProduct,
  totalOrdersByDate,
  totalOrdersByMonth,
  totalOrdersByYear,
  fetchAllOrders,
};
