import express from "express";
import { orderController } from "../controllers/order.controller.js";
import { checkPermission } from "../middleware/check-permission.middleware.js";
import { orderMiddleware } from "../middleware/ecom/order.middleware.js";
import { wrapRequestHandler } from "../lib/handlers.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

// thêm mới đơn hàng
router.post(
  "/create-order",
  wrapRequestHandler(orderMiddleware),
  wrapRequestHandler(orderController.createOrder),
);

// lấy danh sách đơn hàng theo userId(user)
router.get(
  "/get-order-by-user-id",
  wrapRequestHandler(orderController.getOrdersByUserId),
);

// lấy danh sách đơn hàng (admin)
router.get(
  "/get-all-orders",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(orderController.getAllOrders),
);

// update status đơn hàng(admin)
router.patch(
  "/update-order/:orderId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(orderController.updateOrder),
);

// router cancel order
router.patch(
  "/cancel-order/:orderId",
  wrapRequestHandler(orderController.cancelOrder),
);

export default router;
