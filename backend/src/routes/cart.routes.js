import express from "express";
import { cartController } from "../controllers/cart.controller.js";
import { addToCartMiddleware } from "../middleware/ecom/cart.middleware.js";
import { checkPermission } from "../middleware/check-permission.middleware.js";
import { wrapRequestHandler } from "../lib/handlers.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.use(arcjetProtection, protectRoute);

// add to cart
router.post(
  "/add-to-cart",
  wrapRequestHandler(addToCartMiddleware),
  wrapRequestHandler(cartController.addCart),
);

// get carts by userId
router.get("/get-cart", wrapRequestHandler(cartController.getCartByUserId));

// get all carts (admin)
router.get(
  "/carts",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(cartController.getAllCarts),
);

// update quantity product in cart
router.patch(
  "/update-quantity-product-in-cart",
  wrapRequestHandler(cartController.updateQuantityProductInCart),
);

// delete product in cart
router.delete(
  "/delete-product-in-cart",
  wrapRequestHandler(cartController.deleteProductInCart),
);

export default router;
