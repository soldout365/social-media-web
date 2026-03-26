import crypto from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import { ENV } from "../lib/env.js";
import { orderService } from "../services/order.service.js";

dayjs.extend(utc);
dayjs.extend(timezone);

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

function buildQueryString(sortedParams) {
  return Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join("&");
}

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

export const generateVnPayUrl = (req, orderId, amount, bankCode = "") => {

  const now = dayjs().tz("Asia/Ho_Chi_Minh");
  const createDate = now.format("YYYYMMDDHHmmss");
  const expireDate = now.add(15, "minute").format("YYYYMMDDHHmmss");

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

  for (const key of Object.keys(vnp_Params)) {
    const val = vnp_Params[key];
    if (val === undefined || val === null || val === "") {
      delete vnp_Params[key];
    }
  }

  const sortedParams = sortObject(vnp_Params);

  const signData = buildQueryString(sortedParams);
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

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
