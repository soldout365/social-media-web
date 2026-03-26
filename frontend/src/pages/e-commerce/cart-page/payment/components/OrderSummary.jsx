import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck, RotateCcw, Gift } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function OrderSummary({
  selectedProducts,
  subtotal,
  taxAmount,
  totalAmount,
  selectedVoucher,
  handleSubmitOrder,
  isPending,
}) {
  return (
    <div
      className="sticky bg-white border border-gray-100 rounded-3xl p-6 lg:p-8 shadow-sm"
      style={{ top: "2rem" }}
    >
      <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

      {/* Product List */}
      <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {selectedProducts.map((item, index) => (
          <div
            key={`${item.productId._id}-${index}`}
            className="flex gap-4 items-center"
          >
            <div className="relative flex-shrink-0">
              <img
                alt={item.productId.nameProduct}
                className="w-20 h-24 object-cover rounded-2xl border border-gray-100 shadow-sm"
                src={item.productId.images?.[0]?.url || ""}
              />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
                {item.quantity}
              </span>
            </div>
            <div className="flex-grow">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight">
                    {item.productId.nameProduct}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 font-medium">
                    {item.size} — {item.color}
                  </p>
                </div>
                <p className="font-black text-sm whitespace-nowrap">
                  {formatCurrency(
                    item.productId.price *
                      (1 - (item.productId.sale || 0) / 100),
                  )}
                  đ
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Voucher Section (Read-only since it was applied in cart) */}
      {selectedVoucher && (
        <div className="mb-8 p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <Gift className="w-4 h-4 text-pink-500" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Voucher đã áp dụng
                </p>
                <p className="text-sm font-black text-pink-600">
                  {selectedVoucher.code}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-pink-500">
              -{formatCurrency(selectedVoucher.voucherPrice)}đ
            </span>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-8 text-sm">
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Tạm tính</span>
          <span>{formatCurrency(subtotal)}đ</span>
        </div>
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Thuế (1%)</span>
          <span>{formatCurrency(taxAmount)}đ</span>
        </div>
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Phí vận chuyển</span>
          <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">
            Miễn phí
          </span>
        </div>
        <div className="border-t border-gray-100 pt-5 mt-5 flex justify-between items-end">
          <span className="font-bold text-lg">Tổng cộng</span>
          <div className="text-right">
            <span className="block text-3xl font-black tracking-tighter text-gray-900">
              {formatCurrency(totalAmount)}đ
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Đã bao gồm thuế & phí
            </span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <motion.button
        onClick={handleSubmitOrder}
        disabled={isPending}
        whileHover={{ scale: isPending ? 1 : 1.02 }}
        whileTap={{ scale: isPending ? 1 : 0.98 }}
        className={`w-full py-5 rounded-full font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
          isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black text-white shadow-black/10 hover:bg-gray-800"
        }`}
      >
        {isPending ? (
          <>
            <div className="w-5 h-5 border-2 bg-gradient-to-r from-yellow-300 to-pink-500 text-white rounded-full animate-spin" />
            Đang xử lý...
          </>
        ) : (
          <>
            Đặt Hàng Ngay
            <ShoppingBag className="text-white" size={20} />
          </>
        )}
      </motion.button>

      {/* Security Badges */}
      <div className="mt-6 flex items-center justify-center gap-4 text-gray-400">
        <div className="flex items-center gap-1">
          <ShieldCheck size={14} strokeWidth={2} />
          <span className="text-[10px] uppercase font-bold tracking-widest">
            Bảo mật
          </span>
        </div>
        <div className="flex items-center gap-1">
          <RotateCcw size={14} strokeWidth={2} />
          <span className="text-[10px] uppercase font-bold tracking-widest">
            Đổi trả 7 ngày
          </span>
        </div>
      </div>
    </div>
  );
}
