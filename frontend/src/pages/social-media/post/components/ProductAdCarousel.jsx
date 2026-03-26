import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import AdProductCard from "./AdProductCard";
import ProductCartDialog from "@/components/modals/ProductCartDialog";

const ProductAdCarousel = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!products || products.length === 0) return null;

  const handleQuickAdd = (product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div className="my-5 bg-[#0F0F0F] rounded-2xl p-4 border border-[#1A1A1A] overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 bg-pink-500/10 rounded-lg">
          <Sparkles size={14} className="text-pink-500" />
        </div>
        <span className="text-[11px] font-black uppercase tracking-widest text-zinc-300">
          Sản phẩm tiêu điểm
        </span>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="overflow-x-auto pb-2 scrollbar-hide">
        <motion.div
          className="flex gap-4 pr-4"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {products.map((product, index) => (
            <AdProductCard
              key={product._id || index}
              product={product}
              onQuickAdd={handleQuickAdd}
            />
          ))}
        </motion.div>
      </div>

      {/* Add to cart Dialog */}
      <ProductCartDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
      />

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProductAdCarousel;
