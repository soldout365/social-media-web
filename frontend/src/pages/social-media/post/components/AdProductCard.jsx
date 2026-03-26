import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const AdProductCard = ({ product, onQuickAdd }) => {
  if (!product) return null;

  const finalPrice =
    product.sale > 0 ? product.price * (1 - product.sale / 100) : product.price;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="flex flex-col min-w-[160px] max-w-[160px] bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-lg group"
    >
      {}
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        <img
          src={product.images?.[0]?.url || "/placeholder-product.png"}
          alt={product.nameProduct}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {product.sale > 0 && (
          <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
            -{product.sale}%
          </div>
        )}
      </div>

      {}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div className="mb-2">
          <h4 className="text-[11px] font-bold text-zinc-100 line-clamp-1 mb-1 leading-tight">
            {product.nameProduct}
          </h4>
          <div className="flex flex-col gap-0.5">
            <span className="text-[12px] font-black text-pink-500 leading-none">
              {formatCurrency(finalPrice)}đ
            </span>
            {product.sale > 0 && (
              <span className="text-[9px] text-zinc-500 line-through leading-none">
                {formatCurrency(product.price)}đ
              </span>
            )}
          </div>
        </div>

        {}
        <div className="flex gap-2 mt-auto">
          <Button
            size="sm"
            className="flex-1 bg-white hover:bg-zinc-200 text-black h-7 rounded-lg p-0"
            onClick={() => onQuickAdd(product)}
          >
            <ShoppingBag size={12} />
          </Button>
          <Link
            to={`/shopping/detail-product/${product._id}`}
            className="flex items-center justify-center w-7 h-7 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
          >
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default AdProductCard;
