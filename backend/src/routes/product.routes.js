import express from "express";
import { productController } from "../controllers/product.controller.js";
import { checkPermission } from "../middleware/check-permission.middleware.js";
import { productMiddleware } from "../middleware/ecom/product.middleware.js";
import { wrapRequestHandler } from "../lib/handlers.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

router.get(
  "/get-all-product",
  wrapRequestHandler(productController.getAllProduct),
);

router.get(
  "/get-product-by-id/:id",
  wrapRequestHandler(productController.getProductById),
);

router.get(
  "/get-product-with-status/:status/:deleted",
  wrapRequestHandler(productController.getProductWithStatus),
);

router.use(protectRoute);

router.post(
  "/add-product",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productMiddleware),
  wrapRequestHandler(productController.addProduct),
);

router.patch(
  "/update-product-status/:productId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.updateStatus),
);

router.put(
  "/update-product/:productId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productMiddleware),
  wrapRequestHandler(productController.updateProduct),
);

router.delete(
  "/delete-product/:productId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.deleteProduct),
);

router.delete(
  `/hard-delete-multiple-product`,
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.deleteMultiple),
);

router.patch(
  "/soft-delete-product/:productId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.softDeleteProduct),
);
export default router;
