import express from "express";
import { productController } from "../controllers/product.controller.js";
import { checkPermission } from "../middleware/check-permission.middleware.js";
import { productMiddleware } from "../middleware/ecom/product.middleware.js";
import { wrapRequestHandler } from "../lib/handlers.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

//2
// router to get all products
router.get(
  "/get-all-product",
  wrapRequestHandler(productController.getAllProduct)
);
// 3 router to get product by id
router.get(
  "/get-product-by-id/:id",
  wrapRequestHandler(productController.getProductById)
);
// 4 router get product with status
router.get(
  "/get-product-with-status/:status/:deleted",
  wrapRequestHandler(productController.getProductWithStatus)
);

router.use(protectRoute);

//1
router.post(
  "/add-product",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productMiddleware),
  wrapRequestHandler(productController.addProduct)
);

//5  router update status
router.patch(
  "/update-product-status/:productId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.updateStatus)
);
// 6
// router update product
router.put(
  "/update-product/:productId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productMiddleware),
  wrapRequestHandler(productController.updateProduct)
);

// 7 router delete product
router.delete(
  "/delete-product/:productId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.deleteProduct)
);

// 8 xoá cứng nhiều sản phẩm
router.delete(
  `/hard-delete-multiple-product`,
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.deleteMultiple)
);

//10 xóa mềm 1 sản phẩm
router.patch(
  "/soft-delete-product/:productId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(productController.softDeleteProduct)
);
export default router;
