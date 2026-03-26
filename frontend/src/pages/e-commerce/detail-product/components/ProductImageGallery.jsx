import React from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";

export default function ProductImageGallery({
  product,
  currentImage,
  setMainImage,
}) {
  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-container-dark/50 border border-border-dark shadow-xl">
        <img
          alt={product.nameProduct}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          src={currentImage}
        />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Product Original Image Thumbnail */}
        {product.images?.[0]?.url && (
          <div
            className={`aspect-square rounded-xl overflow-hidden bg-container-dark/50 border cursor-pointer relative transition-all duration-300 ${
              currentImage === product.images[0].url
                ? "border-pink-500 ring-2 ring-pink-500/20 shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
                : "border-border-dark hover:border-pink-500/50"
            }`}
            onClick={() => setMainImage(product.images[0].url)}
          >
            <img
              alt={product.nameProduct}
              className="w-full h-full object-cover"
              src={product.images[0].url}
            />
            <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm text-center py-1">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                Nguyên bản
              </span>
            </div>
          </div>
        )}

        {/* Brand Image Thumbnail */}
        <div
          className={`aspect-square rounded-xl overflow-hidden bg-container-dark/50 border cursor-pointer relative group transition-all duration-300 ${
            product.brand?.image && currentImage === product.brand.image
              ? "border-pink-500 ring-2 ring-pink-500/20 shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
              : "border-border-dark hover:border-pink-500/50"
          }`}
          onClick={() => {
            if (product.brand?.image) setMainImage(product.brand.image);
          }}
        >
          {product.brand?.image ? (
            <img
              alt={product.brand?.nameBrand}
              className="w-full h-full object-cover"
              src={product.brand?.image}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <ImageIcon className="w-8 h-8 opacity-50" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">
              Thương hiệu
            </span>
          </div>
        </div>

        {/* Category Image Thumbnail */}
        <div
          className={`aspect-square rounded-xl overflow-hidden bg-container-dark/50 border cursor-pointer relative group transition-all duration-300 ${
            product.category?.image && currentImage === product.category.image
              ? "border-pink-500 ring-2 ring-pink-500/20 shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
              : "border-border-dark hover:border-pink-500/50"
          }`}
          onClick={() => {
            if (product.category?.image) setMainImage(product.category.image);
          }}
        >
          {product.category?.image ? (
            <img
              alt={product.category?.nameCategory}
              className="w-full h-full object-cover"
              src={product.category?.image}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <ImageIcon className="w-8 h-8 opacity-50" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">
              Danh mục
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
