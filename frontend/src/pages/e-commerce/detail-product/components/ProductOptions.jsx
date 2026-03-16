import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductOptions({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  isOptionsOpen,
  setIsOptionsOpen,
  fadeInUp,
}) {
  return (
    <motion.div variants={fadeInUp} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
          Kích thước &amp; Màu sắc
        </h3>
        <a
          href="https://res.cloudinary.com/dizfbl1cv/image/upload/v1773686402/bang_size_ao_la_gi_f332ecb56c40418eb8c1ac6b5fd28687_gnxgop.png"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-white hover:text-pink-300 hover:underline underline-offset-4 transition-colors"
        >
          Bảng quy đổi size
        </a>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setIsOptionsOpen(!isOptionsOpen)}
          className="w-full group flex items-center justify-between px-6 py-4 rounded-xl bg-container-dark/50 border border-border-dark hover:border-pink-500/50 hover:bg-container-dark transition-all duration-300"
        >
          <div className="flex flex-col items-start gap-1">
            <span className="font-bold text-white text-base">
              {selectedColor && selectedSize
                ? `${selectedSize} - ${selectedColor}`
                : "Chọn phân loại (Màu, Size)"}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {product.sizes?.length
                ? `${product.sizes.length} phân loại sẵn có`
                : "Hết hàng"}
            </span>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-white dark:text-slate-100 transition-transform ${
              isOptionsOpen ? "rotate-180" : "group-hover:translate-y-0.5"
            }`}
          />
        </button>

        <AnimatePresence>
          {isOptionsOpen && product.sizes?.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 border-2 border-slate-800/50 rounded-2xl space-y-6 bg-slate-900/10">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-400">Màu sắc</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Set(product.sizes.map((s) => s.color))).map(
                      (color) => (
                        <Button
                          key={color}
                          variant="outline"
                          className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            selectedColor === color
                              ? "bg-gradient-to-tr from-white to-white text-black border-transparent shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
                              : "bg-transparent text-slate-300 border-slate-700/60 hover:border-white/50 hover:text-white hover:bg-white/5"
                          }`}
                          onClick={() => {
                            setSelectedColor(color);
                            setSelectedSize("");
                          }}
                        >
                          {color}
                        </Button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-400">
                    Kích thước
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(
                      new Set(
                        product.sizes
                          .filter(
                            (s) => !selectedColor || s.color === selectedColor
                          )
                          .map((s) => s.size)
                      )
                    ).map((size) => (
                      <Button
                        key={size}
                        variant="outline"
                        disabled={!selectedColor}
                        className={`h-10 px-5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                          selectedSize === size
                            ? "bg-gradient-to-tr from-white to-white text-black border-transparent shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
                            : "bg-transparent text-slate-300 border-slate-700/60 hover:border-white/50 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:hover:border-slate-700/60 disabled:hover:text-slate-300 disabled:hover:bg-transparent"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
