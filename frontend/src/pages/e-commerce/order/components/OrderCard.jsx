import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  RotateCcw,
  Star,
  PackageCheck,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const getStatusConfig = (status) => {
  switch (status) {
    case "pending":
      return {
        label: "Chờ xác nhận",
        bg: "bg-amber-50",
        text: "text-amber-700",
        ring: "ring-amber-600/20",
        icon: <Clock size={14} />,
      };
    case "confirmed":
      return {
        label: "Đã xác nhận",
        bg: "bg-blue-50",
        text: "text-blue-700",
        ring: "ring-blue-600/20",
        icon: <CheckCircle2 size={14} />,
      };
    case "delivery":
      return {
        label: "Đang giao",
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        ring: "ring-indigo-600/20",
        icon: <Truck size={14} />,
      };
    case "completed":
      return {
        label: "Hoàn thành",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        ring: "ring-emerald-600/20",
        icon: <CheckCircle2 size={14} />,
      };
    case "cancelled":
      return {
        label: "Đã hủy",
        bg: "bg-rose-50",
        text: "text-rose-700",
        ring: "ring-rose-600/20",
        icon: <XCircle size={14} />,
      };
    default:
      return {
        label: status || "Không xác định",
        bg: "bg-zinc-100",
        text: "text-zinc-500",
        ring: "ring-zinc-200",
        icon: null,
      };
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const OrderCard = ({ order, onCancel }) => {
  const config = getStatusConfig(order.status);
  const [cancelReason, setCancelReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) return;
    onCancel(order._id, cancelReason);
    setIsDialogOpen(false);
    setCancelReason("");
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`bg-white border border-zinc-100 rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md ${
        order.status === "cancelled" ? "opacity-90" : ""
      }`}
    >
      {}
      <header className="px-8 py-5 flex flex-wrap justify-between items-center bg-zinc-50/50 border-b border-zinc-100/50">
        <div className="flex items-center gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Mã đơn hàng
            </span>
            <span className="font-bold text-zinc-900 tracking-tight">
              #{order._id.substring(order._id.length - 8).toUpperCase()}
            </span>
          </div>
          <div className="hidden sm:flex flex-col border-l border-zinc-200 pl-8">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
              Ngày đặt
            </span>
            <span className="text-sm text-zinc-500 font-semibold">
              {formatDate(order.createdAt)}
            </span>
          </div>
        </div>
        <span
          className={`px-4 py-2 flex items-center gap-2 text-[10px] font-bold uppercase rounded-full tracking-wider ring-1 ring-inset ${config.bg} ${config.text} ${config.ring}`}
        >
          {config.icon}
          {config.label}
        </span>
      </header>

      {}
      <div className="p-8 space-y-8">
        {order.products.map((p, idx) => (
          <div
            key={p._id}
            className={`flex flex-col sm:flex-row sm:items-center gap-6 ${
              idx > 0 ? "pt-8 border-t border-zinc-50" : ""
            }`}
          >
            <div className="relative group flex-shrink-0">
              <img
                alt={p.productId?.nameProduct}
                className="w-20 h-24 object-cover rounded-xl bg-zinc-50 border border-zinc-100 shadow-sm"
                src={p.productId?.images?.[0]?.url || ""}
              />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                {p.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-zinc-900 text-lg leading-tight truncate">
                {p.productId?.nameProduct}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[11px] text-zinc-400 font-medium">
                  Size: {p.size}
                </span>
                <span className="text-zinc-300">•</span>
                <span className="text-[11px] text-zinc-400 font-medium">
                  Màu: {p.color}
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right mt-2 sm:mt-0">
              <p className="font-bold text-zinc-900">
                {formatCurrency(p.price)}đ
              </p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                Đơn giá gốc
              </p>
            </div>
          </div>
        ))}
      </div>

      {}
      <footer className="px-8 py-6 bg-zinc-50/50 border-t border-zinc-100/50 flex flex-col md:flex-row md:justify-between md:items-center gap-8">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
            Phương thức thanh toán
          </span>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-zinc-600 uppercase tracking-tight">
              {order.paymentMethod}
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-8">
          <div className="flex flex-col items-start md:items-end">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
              Tổng thanh toán
            </span>
            <span className="text-2xl font-black text-zinc-900 ">
              {formatCurrency(order.total)}đ
            </span>
          </div>

          <div className="flex gap-2">
            {order.status === "pending" && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="group relative flex-1 md:flex-none h-12 px-8 font-bold text-[11px] uppercase  text-rose-500 hover:text-white rounded-2xl overflow-hidden transition-all duration-500"
                  >
                    {}
                    <div className="absolute inset-0 bg-rose-50/50 group-hover:bg-rose-500 transition-colors duration-500" />

                    {}
                    <div className="absolute inset-0 border border-rose-200/50 group-hover:border-rose-500 rounded-2xl transition-colors duration-500" />

                    {}
                    <div className="relative flex items-center justify-center">
                      <Ban
                        size={16}
                        className="mr-2.5 transition-transform duration-500 group-hover:rotate-180"
                      />
                      Hủy đơn hàng
                    </div>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 text-rose-600">
                      <AlertTriangle size={20} />
                      Xác nhận hủy đơn
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 font-medium">
                      Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động
                      này không thể hoàn tác.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2">
                      <Label
                        htmlFor="reason"
                        className="text-zinc-900 font-bold text-xs uppercase"
                      >
                        Lý do hủy đơn <span className="text-rose-500">*</span>
                      </Label>
                      <Textarea
                        id="reason"
                        placeholder="Nhập lý do hủy đơn (ví dụ: Thay đổi ý định, đặt nhầm sản phẩm...)"
                        className="min-h-[100px] rounded-2xl border-zinc-100 focus:ring-rose-500/20"
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                      variant="ghost"
                      onClick={() => setIsDialogOpen(false)}
                      className="rounded-xl font-bold text-xs uppercase tracking-wider text-zinc-400"
                    >
                      Đóng
                    </Button>
                    <Button
                      onClick={handleConfirmCancel}
                      disabled={!cancelReason.trim()}
                      className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-11 px-6 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-rose-500/20"
                    >
                      Xác nhận hủy
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {order.status === "completed" && (
              <>
                <Button
                  variant="outline"
                  className="flex-1 md:flex-none h-10 px-6 font-bold text-[10px] uppercase tracking-widest border-zinc-200 text-zinc-500 hover:text-zinc-900 rounded-xl transition-all"
                >
                  <Star size={14} className="mr-2" />
                  Đánh giá
                </Button>
                <Button className="flex-1 md:flex-none h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-black text-white hover:bg-zinc-800 rounded-xl transition-all shadow-md shadow-black/5">
                  <RotateCcw size={14} className="mr-2" />
                  Mua lại
                </Button>
              </>
            )}

            {order.status === "delivery" && (
              <Button className="flex-1 md:flex-none h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-500/10">
                <PackageCheck size={14} className="mr-2" />
                Đã nhận hàng
              </Button>
            )}

            {(order.status === "cancelled" || order.status === "confirmed") && (
              <Button className="flex-1 md:flex-none h-10 px-6 font-bold text-[10px] uppercase tracking-widest bg-zinc-900 text-white hover:bg-black rounded-xl transition-all shadow-md shadow-zinc-500/10">
                <RotateCcw size={14} className="mr-2" />
                Mua lại
              </Button>
            )}
          </div>
        </div>
      </footer>
    </motion.article>
  );
};

export default OrderCard;
