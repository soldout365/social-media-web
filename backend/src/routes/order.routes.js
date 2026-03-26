import express from "express";
import { orderController } from "../controllers/order.controller.js";
import { checkPermission } from "../middleware/check-permission.middleware.js";
import { orderMiddleware } from "../middleware/ecom/order.middleware.js";
import { wrapRequestHandler } from "../lib/handlers.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

router.post(
  "/create-order",
  wrapRequestHandler(orderMiddleware),
  wrapRequestHandler(orderController.createOrder),
);

router.get(
  "/get-order-by-user-id",
  wrapRequestHandler(orderController.getOrdersByUserId),
);

router.get(
  "/get-all-orders",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(orderController.getAllOrders),
);

router.patch(
  "/update-order/:orderId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(orderController.updateOrder),
);

router.patch(
  "/cancel-order/:orderId",
  wrapRequestHandler(orderController.cancelOrder),
);

export default router;
