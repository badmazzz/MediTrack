import { Router } from "express";
import {
  allSuppliers,
  getSuppliers,
  getSupplierProducts,
  getSupplierProductsById,
} from "../controllers/supplier.controllers.js";

const router = Router();

router.route("/").get(allSuppliers)
router.route("/:supplierId").get(getSuppliers);
router.route("/:supplierId/products").get(getSupplierProducts);
router.route("/:supplierId/products/:productId").get(getSupplierProductsById);


export default router;