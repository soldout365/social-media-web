import crypto from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { ENV } from "../lib/env.js";
import { orderService } from "../services/order.service.js";

// Extend dayjs với UTC + Timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// -------------------------------------------------------
// HELPER: Sắp xếp object theo alphabet (chuẩn VNPay)
// Keys được encode để sort đúng, values encode + đổi %20 → +
// -------------------------------------------------------
function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj)
    .map((k) => encodeURIComponent(k))
    .sort();

  for (const encodedKey of keys) {
    const originalKey = decodeURIComponent(encodedKey);
    sorted[encodedKey] = encodeURIComponent(obj[originalKey]).replace(
      /%20/g,
      "+",
    );
  }
  return sorted;
}

// -------------------------------------------------------
// HELPER: Build query string dùng native JS (không dùng qs)
// Tránh lỗi format làm sai chữ ký HMAC-SHA512
// -------------------------------------------------------
function buildQueryString(sortedParams) {
  return Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join("&");
}

// -------------------------------------------------------
// HELPER: Verify HMAC-SHA512 từ query params trả về
// -------------------------------------------------------
function verifySignature(queryParams) {
  const vnp_Params = { ...queryParams };
  const secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  const sortedParams = sortObject(vnp_Params);
  const secretKey = ENV.VNP_HASH_SECRET?.trim();
  const signData = buildQueryString(sortedParams);

  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  return { isValid: secureHash === signed, vnp_Params, signData };
}

// -------------------------------------------------------
// UTILITY: Tạo URL thanh toán (dùng nội bộ từ order.controller.js)
// -------------------------------------------------------
export const generateVnPayUrl = (req, orderId, amount, bankCode = "") => {
  // Dùng dayjs timezone để tránh offset UTC (chuẩn VNPay yêu cầu giờ VN)
  const now = dayjs().tz("Asia/Ho_Chi_Minh");
  const createDate = now.format("YYYYMMDDHHmmss");
  const expireDate = now.add(15, "minute").format("YYYYMMDDHHmmss");

  // Lấy IP – split comma để xử lý load balancer, trim whitespace
  let ipAddr = (
    req.headers["x-forwarded-for"] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    "127.0.0.1"
  )
    .split(",")[0]
    .trim();

  if (ipAddr === "::1") ipAddr = "127.0.0.1";

  const tmnCode = ENV.VNP_TMN_CODE?.trim();
  const secretKey = ENV.VNP_HASH_SECRET?.trim();
  const vnpUrl = ENV.VNP_URL?.trim();
  const returnUrl = ENV.VNP_RETURN_URL?.trim();

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
    vnp_OrderType: "other",
    vnp_Amount: Math.floor(amount * 100),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  // -------------------------------------------------------
  // CRITICAL: Payload Sanitization
  // Xóa mọi key có giá trị undefined / null / "" trước khi hash
  // VNPay nghiêm cấm tham số rỗng trong chuỗi ký – đây là nguyên nhân Error 70
  // -------------------------------------------------------
  for (const key of Object.keys(vnp_Params)) {
    const val = vnp_Params[key];
    if (val === undefined || val === null || val === "") {
      delete vnp_Params[key];
    }
  }

  const sortedParams = sortObject(vnp_Params);

  // Build string bằng native JS – không dùng qs để tránh lỗi format chữ ký
  const signData = buildQueryString(sortedParams);
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // queryData giống hệt signData để VNPay verify khớp
  const queryData = buildQueryString(sortedParams);
  const paymentUrl = `${vnpUrl}?${queryData}&vnp_SecureHash=${signed}`;

  console.log("--- VNPay Debug ---");
  console.log("Params sau sanitize:", JSON.stringify(vnp_Params, null, 2));
  console.log("SignData:", signData);
  console.log("Signed:", signed);
  console.log("🚀 Payment URL (test in incognito):", paymentUrl);
  console.log("-------------------");

  return paymentUrl;
};

// -------------------------------------------------------
// ROUTE HANDLER: POST /api/payment/create_payment_url
// -------------------------------------------------------
export const CreatePaymentURL = async (req, res) => {
  try {
    const { orderId, bankCode = "" } = req.body;
    if (!orderId) return res.status(400).json({ message: "Thiếu orderId" });

    const order = await orderService.getOrderById(orderId);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    const paymentUrl = generateVnPayUrl(req, orderId, order.total, bankCode);
    return res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error("Create Payment URL Error:", error);
    return res.status(500).json({ message: "Lỗi tạo link thanh toán" });
  }
};

// -------------------------------------------------------
// ROUTE HANDLER: GET /api/payment/vnpay_ipn (IPN Webhook từ VNPay)
// -------------------------------------------------------
export const ValidatePayment = async (req, res) => {
  const { isValid, vnp_Params } = verifySignature(req.query);

  if (!isValid) {
    return res.status(200).json({ RspCode: "97", Message: "Fail checksum" });
  }

  const rspCode = vnp_Params["vnp_ResponseCode"];
  const orderId = vnp_Params["vnp_TxnRef"];
  const vnpAmount = Number(vnp_Params["vnp_Amount"]);

  try {
    const order = await orderService.getOrderById(orderId);
    if (!order)
      return res
        .status(200)
        .json({ RspCode: "01", Message: "Order not found" });

    // ⚠️ Kiểm tra số tiền để chống tấn công MITM (Amount Tampering)
    if (Math.floor(order.total * 100) !== vnpAmount) {
      return res.status(200).json({ RspCode: "04", Message: "Invalid amount" });
    }

    if (order.status !== "pending") {
      return res
        .status(200)
        .json({ RspCode: "02", Message: "Order already updated" });
    }

    if (rspCode === "00") {
      await orderService.updateOrder({ _id: orderId }, { status: "confirmed" });
    } else {
      await orderService.updateOrder({ _id: orderId }, { status: "cancelled" });
    }

    return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
  } catch (err) {
    console.error("IPN Error:", err);
    return res.status(200).json({ RspCode: "99", Message: "Internal Error" });
  }
};

// -------------------------------------------------------
// ROUTE HANDLER: GET /api/payment/vnpay_return (Return URL từ VNPay)
// -------------------------------------------------------
export const VerifyPayment = async (req, res) => {
  const { isValid, vnp_Params } = verifySignature(req.query);

  if (isValid && vnp_Params["vnp_ResponseCode"] === "00") {
    return res.status(200).json({ status: "success" });
  }

  return res.status(400).json({
    status: "failed",
    message: "Checksum không hợp lệ hoặc giao dịch thất bại",
  });
};
