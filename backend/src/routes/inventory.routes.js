import { Router } from "express";
import {
  productStock,
  restockProduct,
  expiryDateAlerts,
  lowStockAlerts,
  inventoryLogs,
  productCategories,
  totalProducts,
  totalProductsByCategory,
  totalProductsByExpiryDate,
  totalStockValue,
} from "../controllers/inventory.controllers.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middlewares.js";
const router = Router();

router.use(verifyJWT);

router
  .route("/:productId/stock")
  .get(isAdmin, productStock)  // Only admins can check stock
  .post(isAdmin, restockProduct); // Only admins can restock

router.route("/expiry-alerts").get(isAdmin, expiryDateAlerts);
router.route("/lowstock-alerts").get(isAdmin, lowStockAlerts);
router.route("/logs").get(isAdmin, inventoryLogs);
router.route("/categories").get(isAdmin, productCategories);
router.route("/total").get(isAdmin, totalProducts);
router
  .route("/total/category/:category")
  .get(isAdmin, totalProductsByCategory);
router
  .route("/total/expiry/:expiryDate")
  .get(isAdmin, totalProductsByExpiryDate);
router.route("/total/value").get(isAdmin, totalStockValue);

export default router;
