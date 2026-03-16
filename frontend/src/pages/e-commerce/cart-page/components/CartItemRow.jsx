import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash, Minus, Plus } from "lucide-react";
import { useUpdateQuantityInCart } from "@/hooks/ecom/useCart";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CartItemRow({
  item,
  isSelected,
  onToggleSelect,
  onDelete,
}) {
  const [localQuantity, setLocalQuantity] = useState(item.quantity);
  const { mutation: updateQuantityMutation } = useUpdateQuantityInCart();

  // Sync if external data changes (e.g. initial load or refetch)
  useEffect(() => {
    setLocalQuantity(item.quantity);
  }, [item.quantity]);

  // Delete the debouncer logic

  const handleDecrease = () => {
    if (localQuantity > 1) {
      setLocalQuantity((prev) => prev - 1);
      updateQuantityMutation.mutate({
        body: {
          productId: item.productId._id,
          productIdInCart: item._id,
        },
        status: "decrease",
      });
    }
  };

  const handleIncrease = () => {
    setLocalQuantity((prev) => prev + 1);
    updateQuantityMutation.mutate({
      body: {
        productId: item.productId._id,
        productIdInCart: item._id,
      },
      status: "increase",
    });
  };

  const currentPrice = item.productId.price || 0;
  const currentSale = item.productId.sale || 0;
  const priceAfterSale = currentPrice * (1 - currentSale / 100);

  return (
    <motion.div
      variants={itemVariants}
      className={`bg-white dark:bg-slate-900/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex gap-4 transition-all ${
        isSelected ? "opacity-100" : "opacity-80 hover:opacity-100"
      }`}
    >
      <div className="flex items-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() =>
            onToggleSelect(item.productId._id, item.color, item.size)
          }
          className="w-6 h-6 rounded-lg border-slate-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-300 data-[state=checked]:to-pink-500 data-[state=checked]:border-none transition-all"
        />
      </div>
      <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
        <img
          alt={item.productId.nameProduct}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isSelected ? "grayscale-0 scale-105" : "grayscale"
          }`}
          src={
            item.productId.images?.[0]?.url ||
            "https://via.placeholder.com/300"
          }
        />
      </div>
      <div className="flex flex-col flex-1 justify-between py-1">
        <div>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg leading-snug line-clamp-2 max-w-[200px] sm:max-w-md">
              {item.productId.nameProduct}
            </h3>
            <button
              onClick={() => onDelete(item._id)}
              className="text-slate-300 hover:text-red-500 transition-colors p-1"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700">
              {item.size} - {item.color}
            </span>
            {currentSale > 0 && (
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-300 to-pink-500 text-white text-[10px] uppercase tracking-wider font-bold rounded-full">
                Giảm {currentSale}%
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
          <div className="space-y-1">
            <p className="text-xl font-extrabold bg-gradient-to-r from-yellow-400 to-pink-600 bg-clip-text text-transparent">
              {priceAfterSale.toLocaleString("vi-VN")} VND
            </p>
            {currentSale > 0 && (
              <p className="text-sm text-slate-400 line-through decoration-slate-400/50">
                {currentPrice.toLocaleString("vi-VN")} VND
              </p>
            )}
          </div>
          <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={handleDecrease}
              className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all text-slate-600 dark:text-slate-300"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              className="w-10 text-center bg-transparent border-none focus:ring-0 text-sm font-bold [appearance:textfield][&::-webkit-inner-spin-button]:appearance-none"
              type="number"
              value={localQuantity}
              readOnly
            />
            <button
              onClick={handleIncrease}
              className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all text-slate-600 dark:text-slate-300"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
