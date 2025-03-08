import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";

const allSuppliers = asyncHandler(async (req, res) => {
  const suppliers = await User.aggregate([
    {
      $match: {
        role: "supplier",
      },
    },
  ]);
  if (!suppliers) {
    throw new ApiError(404, "No suppliers found");
  }
  res.status(200).json(new ApiResponse(200, suppliers, "All suppliers"));
});

const getSuppliers = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(supplierId)) {
    throw new ApiError(400, "Invalid supplier ID");
  }

  const supplierDetails = await User.aggregate([
    {
      $match: {
        role: "supplier",
        _id: new mongoose.Types.ObjectId(supplierId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "supplier",
        as: "productsSupplied",
      },
    },

    {
      $addFields: {
        totalProductsSupplied: { $size: "$productsSupplied" }, // Add total count of products
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        address: 1,
        createdAt: 1,
        totalProductsSupplied: 1,
      },
    },
  ]);

  if (!supplierDetails) {
    throw new ApiError(404, "Supplier not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        supplierDetails[0],
        "Supplier details fetched successfully"
      )
    );
});

const getSupplierProducts = asyncHandler(async (req, res) => {
  const { supplierId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(supplierId)) {
    throw new ApiError(400, "Invalid supplier ID");
  }

  const supplierProducts = await User.aggregate([
    {
      $match: {
        role: "supplier",
        _id: new mongoose.Types.ObjectId(supplierId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "supplier",
        as: "productsSupplied",
      },
    },

    {
      $addFields: {
        totalProductsSupplied: { $size: "$productsSupplied" },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        createdAt: 1,
        productsSupplied: 1,
        totalProductsSupplied: 1,
      },
    },
  ]);

  if (!supplierProducts) {
    throw new ApiError(404, "No products found for this supplier");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        supplierProducts,
        "Supplier products fetched successfully"
      )
    );
});

const getSupplierProductsById = asyncHandler(async (req, res) => {
  const { supplierId, productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(supplierId)) {
    throw new ApiError(400, "Invalid supplier ID");
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const supplierProduct = await User.aggregate([
    {
      $match: {
        role: "supplier",
        _id: new mongoose.Types.ObjectId(supplierId),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "supplier",
        as: "productsSupplied",
        pipeline: [
          {
            $match: {
              _id: new mongoose.Types.ObjectId(productId), 
            },
          },
          {
            $project: {
              _id: 1, 
              name: 1, 
              price: 1, 
              category: 1, 
              quantity: 1, 
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: 1,
        address: 1,
        createdAt: 1,
        productsSupplied: 1,
      },
    },
  ]);

  if (!supplierProduct || supplierProduct.length === 0) {
    throw new ApiError(404, "Product not found for this supplier");
  }

  res.status(200).json(
    new ApiResponse(
      200,
      supplierProduct[0].productsSupplied[0],
      "Supplier product fetched successfully"
    )
  );
});

export { allSuppliers, getSuppliers, getSupplierProducts, getSupplierProductsById};
