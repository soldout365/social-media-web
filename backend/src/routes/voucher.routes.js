import express from "express";
import { voucherController } from "../controllers/voucher.controller.js";
import { checkPermission } from "../middleware/check-permission.middleware.js";
import { wrapRequestHandler } from "../lib/handlers.js";
import arcjetProtection from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(arcjetProtection, protectRoute);

router.post(
  "/create-voucher",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(voucherController.createVoucher),
);

// lấy danh sách voucher
router.get("/get-vouchers", wrapRequestHandler(voucherController.getVouchers));

// update voucher
router.patch(
  "/update-voucher/:id",
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(voucherController.updateVoucher),
);

// xem chi tiết voucher by id
router.get(
  "/get-voucher/:id",
  wrapRequestHandler(voucherController.getVoucherById),
);

export default router;
