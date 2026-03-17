import dayjs from "dayjs";
import qs from "qs";
import crypto from "crypto";
import { orderService } from "../services/order.service.js";

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[decodeURIComponent(str[key])]).replace(/%20/g, "+");
  }
  return sorted;
}

export const generateVnPayUrl = async (req, orderId, amount, bankCode = "") => {
  process.env.TZ = "Asia/Ho_Chi_Minh";
  const date = new Date();
  const createDate = dayjs(date).format("YYYYMMDDHHmmss");

  const ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket?.remoteAddress ||
    "127.0.0.1";

  const tmnCode = process.env.VNP_TMN_CODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;

  let vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: orderId,
    vnp_OrderInfo: "Thanh toan don hang " + orderId,
    vnp_OrderType: "other",
    vnp_Amount: Math.floor(amount * 100),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac("sha512", secretKey);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;

  return `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;
};

export const CreatePaymentURL = async (req, res) => {
  const { orderId, amount, bankCode } = req.body;
  const url = await generateVnPayUrl(req, orderId, amount, bankCode);
  return res.json({ paymentUrl: url });
};

export const ValidatePayment = async (req, res) => {
  try {
    let vnp_Params = req.query;
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = process.env.VNP_HASH_SECRET;
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash !== signed) {
      return res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }

    const orderId = vnp_Params["vnp_TxnRef"];
    const vnp_Amount = parseInt(vnp_Params["vnp_Amount"]);
    const responseCode = vnp_Params["vnp_ResponseCode"];

    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }

    // VNPay amount is multiplied by 100
    if (order.total * 100 !== vnp_Amount) {
      return res.status(200).json({ RspCode: "04", Message: "Invalid amount" });
    }

    if (order.status !== "pending") {
      return res.status(200).json({ RspCode: "02", Message: "Order already confirmed" });
    }

    if (responseCode === "00") {
      // Thành công
      await orderService.updateOrder({ _id: orderId }, { status: "confirmed" });
    } else {
      // Thất bại - có thể rollback kho ở đây nếu cần, hoặc để user thanh toán lại
      await orderService.updateOrder({ _id: orderId }, { status: "cancelled", reasonCancel: "Thanh toán VNPay thất bại" });
    }

    return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
  } catch (error) {
    console.error("IPN Error:", error);
    return res.status(200).json({ RspCode: "99", Message: "Internal Error" });
  }
};