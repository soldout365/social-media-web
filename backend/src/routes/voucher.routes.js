import express from "express";
import { voucherController } from "../controllers/voucher.controller.js";
// import { checkPermission } from "../middlewares/check-permission.middleware.js";
// import { verifyToken } from "../middlewares/verify-token.middleware.js";
// import { wrapRequestHandler } from "../utils/handlers.util.js";

const router = express.Router();

router.post(
  "/create-voucher",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(checkPermission),
  //wrapRequestHandler(

  voucherController.createVoucher
);

// lấy danh sách voucher
router.get(
  "/get-vouchers",
  // wrapRequestHandler(
  voucherController.getVouchers
);

// update voucher
router.patch(
  "/update-voucher/:id",
  // wrapRequestHandler(verifyToken),
  // wrapRequestHandler(checkPermission),
  // wrapRequestHandler(
  voucherController.updateVoucher
);

// xem chi tiết voucher by id
router.get(
  "/get-voucher/:id",
  // wrapRequestHandler(
  voucherController.getVoucherById
);

export default router;
