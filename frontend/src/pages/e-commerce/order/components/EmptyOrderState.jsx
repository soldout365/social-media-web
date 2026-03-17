import React from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyOrderState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-20 bg-white rounded-3xl border border-zinc-100 border-dashed shadow-sm"
    >
      <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-300">
        <ShoppingBag size={40} />
      </div>
      <h3 className="text-xl font-bold text-zinc-900 mb-2">
        Chưa có đơn hàng nào
      </h3>
      <p className="text-zinc-400 font-medium max-w-xs mx-auto text-sm">
        Hãy tiếp tục mua sắm để lấp đầy lịch sử đơn hàng của bạn nhé!
      </p>
      <Button
        onClick={() => (window.location.href = "/shopping")}
        className="mt-8 bg-black text-white px-10 py-6 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-black/5"
      >
        Mua sắm ngay
      </Button>
    </motion.div>
  );
};

export default EmptyOrderState;
