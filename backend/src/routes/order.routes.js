import { Router } from "express";
import {
  createOrder,
  cancelOrder,
  deleteCancelledOrder,
  updateOrder,
  orderDetails,
  allOrders,
  totalSell,
  totalOrders,
  totalOrdersByStatus,
  totalOrdersByPaymentStatus,
  totalOrdersByUser,
  totalOrdersByProduct,
  totalOrdersByDate,
  totalOrdersByMonth,
  totalOrdersByYear,
  fetchAllOrders,
} from "../controllers/order.controllers.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middlewares.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(allOrders).post(createOrder);
router.route("/delete").delete(isAdmin, deleteCancelledOrder);
router.route("/:orderId").post(isAdmin, updateOrder).delete(cancelOrder);
router.route("/details/:orderId").get(orderDetails);
router.route("/sell").get(isAdmin, totalSell);
router.route("/total").get(isAdmin, totalOrders);
router.route("/total/user").get(isAdmin, totalOrdersByUser);
router.route("/total/product").get(isAdmin, totalOrdersByProduct);  
router.route("/total/status").get(isAdmin, totalOrdersByStatus);
router.route("/total/payment").get(isAdmin, totalOrdersByPaymentStatus);
router.route("/total/date").get(isAdmin, totalOrdersByDate);
router.route("/total/month").get(isAdmin, totalOrdersByMonth);
router.route("/total/year").get(isAdmin, totalOrdersByYear);
router.route("/fetchallorders").get(isAdmin, fetchAllOrders);

export default router;
