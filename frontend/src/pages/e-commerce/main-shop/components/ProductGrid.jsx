import React from "react";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetAllProduct } from "@/hooks/ecom/useProduct";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ProductGrid() {
  const { data } = useGetAllProduct();
  const products = data?.docs || [];

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent">
            Sản Phẩm Cao Cấp
          </h2>
          <p className="text-slate-400 text-sm">
            Hiển thị {products?.length} sản phẩm tinh tuyển
          </p>
        </div>

        <div className="flex-1 max-w-lg group rounded-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-pink-500/40 focus-within:ring-offset-0">
          <div className="relative flex items-center bg-black/60 border border-border-dark rounded-xl px-4 py-2.5">
            <Search className="w-5 h-5 text-slate-500 mr-3 group-focus-within:text-pink-400 transition-colors" />
            <Input
              className="bg-transparent border-none text-slate-200 placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 w-full text-sm p-0 h-auto"
              placeholder="Tìm kiếm phụ kiện độ xe..."
            />
          </div>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {products?.map((product) => (
          <motion.div
            key={product._id || product.id}
            variants={itemVariants}
            className="group bg-container-dark/60 rounded-2xl overflow-hidden border border-border-dark hover:border-pink-500/50 hover:shadow-[0_8px_30px_rgba(236,72,153,0.1)] transition-all duration-300 flex flex-col"
          >
            {/* Image wrapper */}
            <div className="aspect-[4/3] sm:aspect-square relative overflow-hidden bg-black/50">
              <img
                src={product.images[0].url}
                alt={product.nameProduct}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
              />
              {product.hot && (
                <Badge className="absolute top-3 right-3 bg-gradient-to-tr from-yellow-400 to-pink-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase border-none shadow-md">
                  HOT
                </Badge>
              )}
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col flex-1">
              <p className="text-slate-500 text-[11px] uppercase tracking-wider font-semibold mb-1">
                {product.category?.nameCategory}
              </p>
              <h3
                className="text-slate-100 font-bold text-base mb-1 line-clamp-2 leading-tight"
                title={product.nameProduct}
              >
                {product.nameProduct}
              </h3>

              <div className="mt-auto">
                <div className="flex items-baseline gap-2.5 mb-5 flex-wrap">
                  {/* Giá tiền - Điểm nhấn */}
                  <span className="font-black text-lg bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent">
                    {product.price} vnđ
                  </span>
                  {product.oldPrice && (
                    <span className="text-slate-600 text-xs font-medium line-through">
                      {product.oldPrice} vnđ
                    </span>
                  )}
                </div>

                {/* Add to cart Button - Gradient CTA */}
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="w-full bg-gradient-to-tr from-white to-white text-black py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-bold text-xs uppercase h-11 hover:opacity-90 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] border-none">
                    <ShoppingBag className="w-4 h-4" />
                    Thêm vào giỏ
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </>
  );
}
