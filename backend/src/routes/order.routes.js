import { Router } from "express";
import {
  createOrder,
  cancelOrder,
  deleteCancelledOrder,
  updateOrderStatus,
  updatePaymentStatus,
  orderDetails,
  allOrders,
} from "../controllers/order.controllers.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(allOrders).post(createOrder);
router.route("/delete").delete(isAdmin, deleteCancelledOrder);
router.route("/:orderId").delete(cancelOrder);
router.route("/status/:orderId").post(isAdmin, updateOrderStatus);
router.route("/payment/:orderId").post(isAdmin, updatePaymentStatus);
router.route("/details/:orderId").get(orderDetails);

export default router;
