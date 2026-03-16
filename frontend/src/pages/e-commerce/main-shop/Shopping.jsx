"use client";

import React, { useState } from "react";
import { useGetAllCategories } from "@/hooks/ecom/useCategory";
import { useGetAllBrands } from "@/hooks/ecom/useBrand";

import Header from "../main-shop/components/Header";
import FilterSidebar from "../main-shop/components/FilterSidebar";
import ProductGrid from "../main-shop/components/ProductGrid";
import Pagination from "../main-shop/components/Pagination";
import Footer from "../main-shop/components/Footer";

export default function LuxeAutoPage() {
  const { data: categoriesData } = useGetAllCategories();
  const categories = categoriesData?.data?.filter(
    (category) => category.status === "active"
  );

  const { data: brandsData } = useGetAllBrands();
  const brands = brandsData?.data?.filter((brand) => brand.status === "active");

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedBrand, setSelectedBrand] = useState("Tất cả");

  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display selection:bg-pink-500/30 selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          <FilterSidebar
            categories={categories || []}
            brands={brands || []}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
          />

          <div className="flex-1">
            <ProductGrid />
            <Pagination />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
