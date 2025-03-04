// Track Product Stock
// Restock Products
// Expiry Date Alerts
// Inventory Logs
//  Low Stock Alerts
//  Product Categories

//  Supplier Management
// Fields:
// name (String)
// contactPerson (String)
// email (String)
// phone (String)
// address (String)
// Endpoints:
// GET /api/suppliers (list all suppliers)
// POST /api/suppliers (add a new supplier)
// PUT /api/suppliers/:id (update a supplier)
// DELETE / api / suppliers /: id(delete a supplier)
// Dashboard Analytics

// Functionality: Provide a dashboard with key inventory metrics.
// Metrics:
// Total number of products.
// Total stock value.
// Low stock products.
// Expired products.
// Recent inventory changes.
//     Endpoint: GET / api / dashboard

//     Role-Based Access
// Functionality: Restrict inventory management functions to admins only.
// Logic:
// Use middleware to verify user roles (e.g., verifyJWT and isAdmin).
// Only allow admins to add, update, or delete products.
import { Product } from "../models/product.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { updateProductQuantity } from "../utils/updateProductQuantity.js";
import mongoose from "mongoose";

const productStock = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "No product found");
  }

  res.status(200).json(
    new ApiResponse(200, {
      productId: product._id,
      name: product.name,
      quantity: product.quantity,
    })
  );
});

const restockProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (!quantity || quantity < 1) {
    throw new ApiError(400, "Invalid quantity value");
  }

  const product = await updateProductQuantity(productId, quantity, false);

  res.status(200).json(
    new ApiResponse(
      200,
      product,
      "Product restocked successfully"
    )
  );
});

const expiryDateAlerts = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  const oneDayFromNow = new Date(currentDate);
  oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

  const oneWeekFromNow = new Date(currentDate);
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

  const oneMonthFromNow = new Date(currentDate);
  oneMonthFromNow.setDate(oneMonthFromNow.getDate() + 30);

  // Fetch products with expiry dates and categorize them in the query
  const expiredProducts = await Product.find({
    expiryDate: { $lt: currentDate },
  });

  const expiringToday = await Product.find({
    expiryDate: { $gte: currentDate, $lt: oneDayFromNow },
  });

  const expiringThisWeek = await Product.find({
    expiryDate: { $gte: oneDayFromNow, $lt: oneWeekFromNow },
  });

  const expiringThisMonth = await Product.find({
    expiryDate: { $gte: oneWeekFromNow, $lt: oneMonthFromNow },
  });

  res.status(200).json(
    new ApiResponse(200, {
      expiredProducts,
      expiringToday,
      expiringThisWeek,
      expiringThisMonth,
    })
  );
});

const inventoryLogs = asyncHandler(async (req, res) => {
  // Fetch inventory logs
  // Sort logs by date
  // Paginate results
});

const lowStockAlerts = asyncHandler(async (req, res) => {
  
} );

export { productStock, restockProduct, expiryDateAlerts };
