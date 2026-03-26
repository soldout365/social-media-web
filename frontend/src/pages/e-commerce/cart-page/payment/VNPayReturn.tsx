import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { toast } from "react-hot-toast";

const ButtonAny = Button as any;

export default function VNPayReturn() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [verifyStatus, setVerifyStatus] = useState<
    "success" | "failed" | "error"
  >("failed");

  const orderId = searchParams.get("vnp_TxnRef");
  const amount = searchParams.get("vnp_Amount");

  useEffect(() => {
    const verify = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `payment/vnpay_return?${searchParams.toString()}`,
        );
        if (response.status === 200) {
          setVerifyStatus("success");
          toast.success("Xác nhận thanh toán thành công!");
        } else {
          setVerifyStatus("failed");
        }
      } catch (err: any) {
        console.error("Verify error:", err);
        setVerifyStatus(err?.response?.status === 400 ? "failed" : "error");
        toast.error(err?.response?.data?.message || "Lỗi xác thực thanh toán.");
      } finally {
        setLoading(false);
      }
    };

    if (searchParams.get("vnp_SecureHash")) {
      verify();
    } else {
      setLoading(false);
      setVerifyStatus("failed");
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FDFDFD]">
        <Loader2 className="w-12 h-12 animate-spin text-zinc-900 mb-4" />
        <p className="text-zinc-500 font-medium animate-pulse">
          Đang xác thực giao dịch...
        </p>
      </div>
    );
  }

  const isSuccess = verifyStatus === "success";

  return (
    <div
      className="min-h-screen bg-[#FDFDFD] flex items-center justify-center p-4"
      style={{ fontFamily: '"Inter", sans-serif' }}
    >
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
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 ${isSuccess ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}
          >
            {isSuccess ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
          </motion.div>

          <h1 className="text-3xl font-black tracking-tighter mb-4 text-zinc-900">
            {isSuccess ? "Thanh toán thành công!" : "Giao dịch thất bại"}
          </h1>
          <p className="text-sm text-zinc-500 font-medium leading-relaxed mb-10 max-w-sm">
            {isSuccess
              ? "Đơn hàng đã được xác nhận và đang được xử lý."
              : verifyStatus === "error"
                ? "Có lỗi hệ thống khi xác thực. Vui lòng liên hệ hỗ trợ."
                : "Giao dịch thất bại hoặc chữ ký không hợp lệ. Vui lòng thử lại."}
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
                Số tiền
              </span>
              <span className="font-black text-zinc-900">
                {amount ? (Number(amount) / 100).toLocaleString("vi-VN") : "0"}{" "}
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
                {isSuccess ? "Verified & Paid" : "Failed / Unverified"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <ButtonAny
              asChild
              className="h-14 rounded-2xl bg-zinc-900 hover:bg-black text-white font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.02]"
            >
              <Link to="/order">
                <ClipboardList className="mr-2" size={18} />
                Theo dõi đơn hàng
              </Link>
            </ButtonAny>
            <ButtonAny
              asChild
              variant="outline"
              className="h-14 rounded-2xl border-zinc-200 hover:border-zinc-900 hover:bg-zinc-50 font-bold text-sm uppercase tracking-wider transition-all hover:scale-[1.02]"
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
