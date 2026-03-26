import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmptyCartState() {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 text-center mt-20"
    >
      <div className="max-w-xs sm:max-w-sm">
        <div className="w-32 h-32 mx-auto mb-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center shadow-inner">
          <ShoppingCart className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold mb-2">Giỏ hàng của bạn đang trống</h2>
        <p className="text-slate-500 text-sm mb-6">
          Sản phẩm sẽ được lưu trong giỏ hàng 30 ngày. Đừng để món đồ yêu thích
          của bạn vụt mất!
        </p>
        <Button
          onClick={() => navigate("/shopping")}
          className="inline-flex h-auto items-center gap-2 bg-gradient-to-r from-yellow-300 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform border-none shadow-lg text-sm"
        >
          <Search className="w-4 h-4" />
          Tiếp tục mua sắm
        </Button>
      </div>
    </motion.div>
  );
}
