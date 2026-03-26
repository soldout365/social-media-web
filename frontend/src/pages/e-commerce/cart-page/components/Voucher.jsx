import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import { Ticket, Clock, Info, CheckCircle2 } from "lucide-react";
import { voucherApi } from "@/apis/ecom/voucher.api.ts";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const VoucherCard = ({ voucher, isSelected, onClick }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(voucher)}
      className={cn(
        "relative flex w-full cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300",
        isSelected
          ? "border-pink-500 bg-pink-500/5 shadow-[0_8px_30px_rgba(236,72,153,0.15)]"
          : "border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900/40 hover:border-pink-300 dark:hover:border-pink-500/50",
      )}
    >
      {/* Left Decoration - Coupon Style */}
      <div
        className={cn(
          "flex w-24 flex-col items-center justify-center gap-2 border-r border-dashed py-4",
          isSelected
            ? "border-pink-200 dark:border-pink-800 bg-pink-500 text-white"
            : "border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-pink-500",
        )}
      >
        <Ticket className="h-8 w-8" />
        <span className="text-[10px] font-black uppercase tracking-tighter">
          Voucher
        </span>

        {/* Punch out holes */}
        <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#f8f6f6] dark:bg-[#1a1a1a]" />
        <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#f8f6f6] dark:bg-[#1a1a1a]" />
      </div>

      {/* Right Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {voucher.code}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              {voucher.desc}
            </p>
          </div>
          <Badge
            className={cn(
              "text-[10px] font-bold px-2 py-0.5",
              isSelected
                ? "bg-pink-500 text-white"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
            )}
          >
            Còn {voucher.discount} lượt
          </Badge>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-medium">
              <Clock className="h-3 w-3" />
              <span>
                Hết hạn: {dayjs(voucher.endDate).format("DD/MM/YYYY")}
              </span>
            </div>
          </div>

          <div
            className={cn(
              "rounded-full p-1.5 transition-colors",
              isSelected
                ? "bg-pink-500 text-white"
                : "bg-slate-50 dark:bg-slate-800 text-slate-300",
            )}
          >
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const VoucherList = ({ onSelectedVoucher, currentVoucherId }) => {
  const { data: responseVouchers, isLoading } = useQuery({
    queryKey: ["vouchers-active"],
    queryFn: () => voucherApi.getVouchers({ status: "active" }),
  });

  const vouchers = responseVouchers?.data || [];

  if (isLoading) {
    return (
      <div className="flex h-60 w-full flex-col items-center justify-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
        <p className="text-sm font-medium text-slate-400">
          Đang tìm ưu đãi cho bạn...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-2 max-h-[450px] overflow-y-auto px-1 custom-scrollbar">
      <AnimatePresence mode="popLayout">
        {vouchers.length > 0 ? (
          vouchers.map((voucher) => (
            <VoucherCard
              key={voucher._id}
              voucher={voucher}
              isSelected={currentVoucherId === voucher._id}
              onClick={onSelectedVoucher}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-800">
              <Info className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white">
              Chưa có mã giảm giá
            </h4>
            <p className="text-sm text-slate-500">
              Hãy quay lại sau để nhận thêm ưu đãi nhé!
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoucherList;
