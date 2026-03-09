import express from "express";
import { cartController } from "../controllers/cart.controller.js";
import { addToCartMiddleware } from "../middleware/ecom/cart.middleware.js";
// import { checkPermission } from "../middlewares/check-permission.middleware.js";
// import { verifyToken } from "../middlewares/verify-token.middleware.js";
// import { wrapRequestHandler } from "../utils/handlers.util.js";

const router = express.Router();

const mockUserMiddleware = (req, res, next) => {
  // Giả lập dữ liệu user đang đăng nhập
  req.user = {
    // Ưu tiên lấy userId từ body (để test tạo giỏ hàng mượt), nếu không có thì lấy chuỗi cố định
    _id: req.body.userId || "6926b879106fe518fdb4b09d",
    role: "customer", // Hoặc đổi thành "admin" nếu muốn test quyền admin
  };
  next();
};

// add to cart
router.post(
  "/add-to-cart",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(addToCartMiddleware),
  // wrapRequestHandler(cartController.addCart)
  mockUserMiddleware,
  addToCartMiddleware,
  cartController.addCart
);

// get carts by userId
router.get(
  "/get-cart",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(
  mockUserMiddleware,
  cartController.getCartByUserId
);

// get all carts (admin)
router.get(
  "/carts",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(checkPermission),
  // wrapRequestHandler(
  mockUserMiddleware,
  cartController.getAllCarts
);

// update quantity product in cart
router.patch(
  "/update-quantity-product-in-cart",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(
  mockUserMiddleware,
  cartController.updateQuantityProductInCart
);

// delete product in cart
router.delete(
  "/delete-product-in-cart",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(
  mockUserMiddleware,
  cartController.deleteProductInCart
);

export default router;
