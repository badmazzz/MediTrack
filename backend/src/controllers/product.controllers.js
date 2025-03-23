import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.models.js";

const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    quantity,
    category,
    manufactureDate,
    expiryDate,
  } = req.body;

  const user = req.user;
  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }
  console.log(user);
  if (user.role !== "admin" && user.role !== "employee") {
    throw new ApiError(403, "You are not authorized to perform this action");
  }

  if (
    !name ||
    !description ||
    !price ||
    !quantity ||
    !category ||
    !manufactureDate ||
    !expiryDate
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const productExist = await Product.findOne({ name });
  if (productExist) {
    throw new ApiError(409, "Product already exists");
  }

  const imageLocalPath = req.files?.productImage[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Product image is required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image || !image.url) {
    throw new ApiError(400, "Failed to upload image");
  }

  const product = await Product.create({
    name,
    description,
    price,
    quantity,
    category,
    manufactureDate,
    expiryDate,
    productImage: image.url,
    whoAdded: user._id,
  });

  if (!product) {
    throw new ApiError(500, "Something went wrong while creating the product");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

// Get all products
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});

  if (!products || products.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No products found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully"));
});

// Get product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product retrieved successfully"));
});

// Update product by ID
const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { name, description, price, category, manufactureDate, expiryDate } =
    req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (
    !name &&
    !description &&
    !price &&
    !category &&
    !manufactureDate &&
    !expiryDate
  ) {
    throw new ApiError(400, "At least one field is required for update");
  }

  const updateObject = {};
  if (name) updateObject.name = name;
  if (description) updateObject.description = description;
  if (price) updateObject.price = price;
  if (category) updateObject.category = category;
  if (manufactureDate) updateObject.manufactureDate = manufactureDate;
  if (expiryDate) updateObject.expiryDate = expiryDate;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      $set: updateObject,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

// Delete product by ID
const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findByIdAndDelete(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product deleted successfully"));
});

// 2️⃣ Additional Functions (For better functionality)
// ✔️ Search Products (by name, category, price range)
// ✔️ Filter & Sort Products
// ✔️ Paginate Product List
// ✔️ Check Product Availability (based on quantity)
// ✔️ Handle Product Expiry (for perishable items)

// Search products by name, category, or price range
const searchProducts = asyncHandler(async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  minPrice = minPrice ? minPrice : 0;
  maxPrice = maxPrice ? maxPrice : 1000000;
  const filter = {};
  if (name) filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
  if (category) filter.category = { $regex: category, $options: "i" };
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  const products = await Product.find(filter);

  if (!products || products.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, [], "No products found matching the criteria")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully"));
});

// Filter and sort products
const filterAndSortProducts = asyncHandler(async (req, res) => {
  const { category, minPrice, maxPrice, sortBy, sortOrder } = req.query;

  // Define valid categories
  const validCategories = ["Supplies", "Medicines", "Equipment"];

  const filter = {};

  // Category filtering with validation
  if (category) {
    const categories = category.split(",").map((c) => c.trim());
    const validCategoriesFilter = categories.filter((c) =>
      validCategories.includes(c)
    );

    if (validCategoriesFilter.length > 0) {
      filter.category = { $in: validCategoriesFilter };
    }
  }

  // Price filtering
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  // Sorting logic
  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;
  }

  // Fetch products
  const products = await Product.find(filter).sort(sortOptions);

  if (!products || products.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, [], "No products found matching the criteria")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully"));
});

// Paginate product list
const paginateProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const products = await Product.paginate({}, options);

  if (!products || products.docs.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No products found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products retrieved successfully"));
});

// Check product availability (based on quantity)
const checkProductAvailability = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  // Validate productId
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const isAvailable = product.quantity > 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        productId: product._id,
        name: product.name,
        quantity: product.quantity,
        isAvailable,
      },
      isAvailable ? "Product is available" : "Product is out of stock"
    )
  );
});

// Handle product expiry (for perishable items)
const handleProductExpiry = asyncHandler(async (req, res) => {
  const currentDate = new Date();

  // Find products where expiryDate is less than or equal to the current date
  const expiredProducts = await Product.find({
    expiryDate: { $lte: currentDate },
  });

  if (!expiredProducts || expiredProducts.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No expired products found"));
  }

  // Optionally, you can delete or mark these products as expired
  await Product.deleteMany({ expiryDate: { $lte: currentDate } });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        expiredProducts,
        "Expired products handled successfully"
      )
    );
});

// 3️⃣ Advanced Features (Optional but useful)
// ✔️ Upload/Update Product Image
// ✔️ Bulk Add/Update Products
// ✔️ Apply Discounts on Products
// ✔️ Add Reviews & Ratings
// ✔️ Track Inventory Changes

export {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts,
  filterAndSortProducts,
  paginateProducts,
  checkProductAvailability,
  handleProductExpiry,
};
