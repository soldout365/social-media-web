import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Shirt } from "lucide-react";

export default function ProductInfo({ product, fadeInUp }) {
  return (
    <>
      <motion.div
        variants={fadeInUp}
        className="flex items-center gap-3 group cursor-pointer"
      >
        <div className="size-12 rounded-full overflow-hidden border-2 border-primary/20 p-0.5">
          {product.category?.image ? (
            <img
              alt={product.category?.nameCategory}
              className="w-full h-full object-cover rounded-full"
              src={product.category?.image}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
              <Shirt className="w-5 h-5 text-slate-400" />
            </div>
          )}
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Danh mục
          </span>
          <p className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
            {product.category?.nameCategory || "Khác"}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform ml-auto" />
      </motion.div>

      <motion.div variants={fadeInUp} className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white line-clamp-2">
          {product.nameProduct}
        </h1>
        <div className="flex items-baseline gap-4 mt-4 flex-wrap">
          <span className="text-3xl font-extrabold bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent">
            {product.price.toLocaleString("vi-VN")} vnđ
          </span>
          {product.oldPrice && (
            <span className="text-lg font-medium text-slate-400 line-through">
              {product.oldPrice.toLocaleString("vi-VN")} VND
            </span>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={fadeInUp}
        className="h-px bg-border-dark/50 w-full"
      ></motion.div>

      <motion.div variants={fadeInUp} className="space-y-2">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest">
          Mô tả sản phẩm
        </h3>
        <p className="text-slate-400 leading-relaxed text-sm">
          {product.desc || "Sản phẩm chưa có mô tả."}
        </p>
      </motion.div>
    </>
  );
}
