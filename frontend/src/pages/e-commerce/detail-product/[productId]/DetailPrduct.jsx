import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetProductById, useGetAllProduct } from "@/hooks/ecom/useProduct";
import { useAddToCart } from "@/hooks/ecom/useCart";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import Header from "../../main-shop/components/Header";
import Footer from "../../main-shop/components/Footer";

import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import ProductOptions from "../components/ProductOptions";
import ProductActions from "../components/ProductActions";
import RelatedProducts from "../components/RelatedProducts";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function DetailPrduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { data: productResponse, isLoading } = useGetProductById(productId);
  const product = productResponse?.data || productResponse;

  const { data: relatedData } = useGetAllProduct({ limit: 5 });
  const relatedProducts =
    relatedData?.docs
      ?.filter(
        (p) =>
          (p.brand?._id === product?.brand?._id ||
            p.brand === product?.brand) &&
          p._id !== product?._id,
      )
      .slice(0, 2) || [];

  const { mutation: addToCartMutation } = useAddToCart();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(true);
  const [mainImage, setMainImage] = useState(null); 

  const currentImage = mainImage || product?.images?.[0]?.url;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize || !product) return;
    const data = {
      productId: product._id,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    };
    addToCartMutation.mutate(data);
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize || !product) return;
    const data = {
      productId: product._id,
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    };
    addToCartMutation.mutate(data, {
      onSuccess: () => navigate("/cart"),
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
        Đang tải...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark text-white">
        Không tìm thấy sản phẩm!
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display selection:bg-pink-500/30 selection:text-white pb-10">
      {}
      <Header />

      {}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {}
          <ProductImageGallery
            product={product}
            currentImage={currentImage}
            setMainImage={setMainImage}
          />

          {}
          <motion.div
            className="flex flex-col gap-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <ProductInfo product={product} fadeInUp={fadeInUp} />

            <ProductOptions
              product={product}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              isOptionsOpen={isOptionsOpen}
              setIsOptionsOpen={setIsOptionsOpen}
              fadeInUp={fadeInUp}
            />

            <ProductActions
              product={product}
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              handleAddToCart={handleAddToCart}
              handleBuyNow={handleBuyNow}
              fadeInUp={fadeInUp}
            />
          </motion.div>
        </div>

        {}
        <RelatedProducts relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </div>
  );
}
