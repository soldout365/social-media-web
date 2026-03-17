import React, { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ArrowRight,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ButtonAny = Button as any;

export default function VNPayResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const responseCode = searchParams.get("vnp_ResponseCode");
  const isSuccess = responseCode === "00";
  const orderId = searchParams.get("vnp_TxnRef");
  const amount = searchParams.get("vnp_Amount");

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-zinc-100 overflow-hidden"
      >
        <div
          className={`h-3 w-full ${isSuccess ? "bg-emerald-500" : "bg-rose-500"}`}
        />

        <div className="p-10 lg:p-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${
              isSuccess
                ? "bg-emerald-50 text-emerald-500"
                : "bg-rose-50 text-rose-500"
            }`}
          >
            {isSuccess ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
          </motion.div>

          <h1 className="text-3xl font-black tracking-tighter mb-4">
            {isSuccess ? "Thanh toán thành công!" : "Giao dịch thất bại"}
          </h1>

          <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-10 max-w-sm">
            {isSuccess
              ? "Tuyệt vời! Đơn hàng của bạn đã được xác nhận và đang được xử lý. Chúng tôi sẽ thông báo cho bạn ngay khi hàng được giao."
              : "Rất tiếc, đã có lỗi xảy ra trong quá trình thanh toán. Bạn có thể thử lại hoặc chọn phương thức thanh toán khác."}
          </p>

          <div className="w-full bg-zinc-50 rounded-3xl p-6 mb-10 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-bold uppercase tracking-widest">
                Mã đơn hàng
              </span>
              <span className="font-black text-zinc-900">
                #{orderId || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-bold uppercase tracking-widest">
                Số tiền thanh toán
              </span>
              <span className="font-black text-zinc-900">
                {amount
                  ? (Number(amount) / 100).toLocaleString("vi-VN")
                  : "0"}{" "}
                VNĐ
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400 font-bold uppercase tracking-widest">
                Trạng thái
              </span>
              <span
                className={`font-black uppercase tracking-tighter ${isSuccess ? "text-emerald-500" : "text-rose-500"}`}
              >
                {isSuccess ? "Confirmed" : "Failed / Cancelled"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <ButtonAny
              asChild
              className="h-14 rounded-2xl bg-zinc-900 hover:bg-black text-white font-bold text-sm uppercase tracking-wider"
            >
              <Link to="/order">
                <ClipboardList className="mr-2" size={18} />
                Theo dõi đơn hàng
              </Link>
            </ButtonAny>
            <ButtonAny
              asChild
              variant="outline"
              className="h-14 rounded-2xl border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 font-bold text-sm uppercase tracking-wider"
            >
              <Link to="/shopping">
                Tiếp tục mua sắm
                <ArrowRight className="ml-2" size={18} />
              </Link>
            </ButtonAny>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
