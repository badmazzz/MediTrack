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
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    verifyJWT,
    upload.fields([{ name: "productImage", maxCount: 1 }]),
    createProduct
  );
router.route("/expiry").get(verifyJWT, handleProductExpiry);
router.route("/search").get(searchProducts);
router.route("/filter").get(filterAndSortProducts);
router.route("/paginate").get(paginateProducts);
router.route("/availability").get(checkProductAvailability);
router
  .route("/:productId")
  .get(getProductById)
  .patch(verifyJWT, updateProduct)
  .delete(verifyJWT, deleteProduct);

export default router;
