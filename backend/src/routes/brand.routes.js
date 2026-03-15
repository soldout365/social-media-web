import {
  createBrand,
  getBrandById,
  getBrands,
  updateBrand,
} from "../controllers/brand.controller.js";

import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { brandMiddleware } from "../middleware/ecom/brand.middleware.js";
import { checkPermission } from "../middleware/check-permission.middleware.js";
import { wrapRequestHandler } from "../lib/handlers.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection);

// get all
router.get("/get-all-brands", wrapRequestHandler(getBrands));
// get by id
router.get("/get-brand-by-id/:brandId", wrapRequestHandler(getBrandById));

router.use(protectRoute);

// create brand
router.post(
  "/create-brand",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(brandMiddleware),
  wrapRequestHandler(createBrand)
);
// update
router.patch(
  "/update-brand/:brandId",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(updateBrand)
);

export default router;
