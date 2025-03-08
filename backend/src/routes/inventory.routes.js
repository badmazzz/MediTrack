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

router
  .route("/:productId/stock")
  .get(verifyJWT, isAdmin, productStock)
  .post(verifyJWT, isAdmin, restockProduct);

router.route("/expiry-alerts").get(verifyJWT, isAdmin, expiryDateAlerts);
router.route("/lowstock-alerts").get(verifyJWT, isAdmin, lowStockAlerts);
router.route("/logs").get(verifyJWT, isAdmin, inventoryLogs);   


export default router;
