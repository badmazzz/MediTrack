import { Router } from "express";
import {
  allSuppliers,
  getSuppliers,
  getSupplierProducts,
  getSupplierProductsById,
} from "../controllers/supplier.controllers.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(isAdmin,allSuppliers)
router.route("/:supplierId").get(getSuppliers);
router.route("/:supplierId/products").get(getSupplierProducts);
router.route("/:supplierId/products/:productId").get(getSupplierProductsById);


export default router;