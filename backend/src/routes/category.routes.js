import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";

import { categoryMiddleware } from "../middleware/ecom/category.middleware.js";
import { checkPermission } from "../middleware/check-permission.middleware.js";
import { wrapRequestHandler } from "../lib/handlers.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.use(arcjetProtection);

// get all
router.get("/get-categories", wrapRequestHandler(getCategories));
// get by id
router.get("/get-category-by-id/:id", wrapRequestHandler(getCategoryById));

router.use(protectRoute);

// create brand
router.post(
  "/create-category",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(categoryMiddleware),
  wrapRequestHandler(createCategory)
);
// update
router.patch(
  "/update-category-by-id/:id",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(updateCategory)
);

// delete
router.delete(
  "/delete-category-by-id/:id",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(deleteCategory)
);

export default router;
