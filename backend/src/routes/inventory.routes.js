import { Router } from "express";
import {
  productStock,
  restockProduct,
    expiryDateAlerts,
    lowStockAlerts,
    inventoryLogs,
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
  


export default router;
