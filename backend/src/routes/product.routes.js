import { Router } from "express";
import {
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
} from "../controllers/product.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();

router.use(verifyJWT);

router
  .route("/")
  .get(getAllProducts)
  .post(
    isAdmin, // Only admins can create products
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    createProduct
  );

router.route("/expiry").get(handleProductExpiry);
router.route("/search").get(searchProducts);
router.route("/filter").get(filterAndSortProducts);
router.route("/paginate").get(paginateProducts);
router.route("/availability").get(checkProductAvailability);

router
  .route("/:productId")
  .get(getProductById)
  .patch(
    isAdmin,
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    updateProduct
  ) // Only admins can update products
  .delete(isAdmin, deleteProduct); // Only admins can delete products

export default router;
