import express from "express";
import { orderController } from "../controllers/order.controller.js";
// import { checkPermission } from "../middlewares/check-permission.middleware.js";
import { orderMiddleware } from "../middleware/ecom/order.middleware.js";
// import { verifyToken } from "../middlewares/verify-token.middleware.js";
// import { wrapRequestHandler } from "../utils/handlers.util.js";

const router = express.Router();

const mockUserMiddleware = (req, res, next) => {
  // Giả lập dữ liệu user đang đăng nhập
  req.user = {
    // Ưu tiên lấy userId từ body (để test tạo đơn hàng mượt), nếu không có thì lấy chuỗi cố định
    _id: req.body.userId || "6926b879106fe518fdb4b09d",
    role: "customer", // Hoặc đổi thành "admin" nếu muốn test quyền admin ở API khác
  };
  next();
};

// thêm mới đơn hàng
router.post(
  "/create-order",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(orderMiddleware),
  // wrapRequestHandler(orderController.createOrder)
  mockUserMiddleware,
  orderMiddleware,
  orderController.createOrder
);

// lấy danh sách đơn hàng theo userId
router.get(
  "/get-order-by-user-id",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(
  mockUserMiddleware,
  orderController.getOrdersByUserId
);

// lấy danh sách đơn hàng
router.get(
  "/get-all-orders",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(checkPermission),
  // wrapRequestHandler(
  mockUserMiddleware,
  orderController.getAllOrders
);

// update status đơn hàng
router.patch(
  "/update-order/:orderId",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(checkPermission),
  // wrapRequestHandler(
  mockUserMiddleware,
  orderController.updateOrder
);

// router cancel order
router.patch(
  "/cancel-order/:orderId",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(
  mockUserMiddleware,
  orderController.cancelOrder
);

export default router;
