import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Shirt } from "lucide-react";

export default function RelatedProducts({ relatedProducts }) {
  return (
    <motion.section
      className="mt-24"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">
          Sản phẩm liên quan
        </h2>
        <a
          className="text-pink-400 font-semibold text-sm flex items-center gap-1 hover:text-pink-300 transition-colors"
          href="#"
        >
          Xem tất cả
          <ChevronRight className="w-4 h-4" />
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {relatedProducts.map((relProduct) => (
          <div key={relProduct._id} className="group cursor-pointer">
            <Link to={`/shopping/detail-product/${relProduct._id}`}>
              <div className="aspect-[3/4] rounded-xl bg-container-dark/50 border border-border-dark mb-4 overflow-hidden relative">
                {relProduct.images?.[0]?.url ? (
                  <img
                    src={relProduct.images[0].url}
                    alt={relProduct.nameProduct}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/10 to-pink-500/30 transition-transform duration-500 group-hover:scale-105">
                    <Shirt className="text-pink-500/40 w-12 h-12" />
                  </div>
                )}
              </div>
              <p className="font-bold text-slate-100 line-clamp-1 group-hover:text-pink-400 transition-colors">
                {relProduct.nameProduct}
              </p>
              <p className="text-pink-500 font-extrabold mt-1">
                {relProduct.price.toLocaleString("vi-VN")} vnđ
              </p>
            </Link>
          </div>
        ))}

        {relatedProducts.length === 0 && (
          <div className="col-span-full py-10 text-center text-slate-500 italic">
            Cửa hàng chưa có sản phẩm liên quan nào thuộc brand này.
          </div>
        )}
      </div>
    </motion.section>
  );
}
