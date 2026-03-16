import React from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Truck, BadgeCheck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductActions({
  product,
  selectedColor,
  selectedSize,
  handleAddToCart,
  handleBuyNow,
  fadeInUp,
}) {
  return (
    <>
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row gap-4 pt-6"
      >
        <Button
          variant="outline"
          disabled={
            !selectedColor || !selectedSize || product.sizes?.length === 0
          }
          onClick={handleAddToCart}
          className="flex-1 bg-gradient-to-tr from-white to-white text-black font-bold h-12 rounded-xl border-none hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <ShoppingCart className="w-4 h-4" />
          Thêm giỏ hàng
        </Button>
        <Button
          variant="default"
          disabled={
            !selectedColor || !selectedSize || product.sizes?.length === 0
          }
          onClick={handleBuyNow}
          className="flex-1 bg-gradient-to-r from-yellow-400 to-pink-600 text-white font-black h-12 rounded-xl border-none hover:scale-[1.02] shadow-[0_4px_15px_rgba(236,72,153,0.3)] hover:shadow-[0_8px_25px_rgba(236,72,153,0.4)] transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          Mua ngay
        </Button>
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 pt-8">
        <div className="flex flex-col items-center text-center gap-1">
          <Truck className="text-slate-400 w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Giao hỏa tốc
          </span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <BadgeCheck className="text-slate-400 w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Chính hãng
          </span>
        </div>
        <div className="flex flex-col items-center text-center gap-1">
          <RefreshCw className="text-slate-400 w-6 h-6 mb-1" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">
            Đổi trả 7 ngày
          </span>
        </div>
      </motion.div>
    </>
  );
}
