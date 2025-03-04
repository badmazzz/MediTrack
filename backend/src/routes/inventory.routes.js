import { Router } from "express";
import {
  productStock,
  restockProduct,
  expiryDateAlerts,
} from "../controllers/inventory.controllers.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middlewares.js";
const router = Router();

router
  .route("/:productId/stock")
  .get(verifyJWT, isAdmin, productStock)
  .post(verifyJWT, isAdmin, restockProduct);

router.route("/expiry-alerts").get(verifyJWT, isAdmin, expiryDateAlerts);

export default router;
