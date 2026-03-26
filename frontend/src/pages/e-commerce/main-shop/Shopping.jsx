"use client";

import React from "react";
import { useGetAllCategories } from "@/hooks/ecom/useCategory";
import { useGetAllBrands } from "@/hooks/ecom/useBrand";

import { useSearchParams } from "react-router-dom";
import Header from "../main-shop/components/Header";
import FilterSidebar from "../main-shop/components/FilterSidebar";
import ProductGrid from "../main-shop/components/ProductGrid";
import Pagination from "../main-shop/components/Pagination";
import Footer from "../main-shop/components/Footer";
import { useGetAllProduct } from "@/hooks/ecom/useProduct";

export default function LuxeAutoPage() {
  const { data: categoriesData } = useGetAllCategories();
  const categories = categoriesData?.data?.filter(
    (category) => category.status === "active",
  );

  const { data: brandsData } = useGetAllBrands();
  const brands = brandsData?.data?.filter((brand) => brand.status === "active");
  const [searchParams] = useSearchParams();
  const currentPage = Number(searchParams.get("_page")) || 1;
  const queryQ = searchParams.get("q") || "";
  const queryCategory = searchParams.get("category") || "";
  const queryBrand = searchParams.get("brand") || "";

  const { data: productsData } = useGetAllProduct({
    _page: currentPage,
    _limit: 8,
    q: queryQ,
    category: queryCategory,
    brand: queryBrand,
  });

  const totalPages = productsData?.totalPages || 1;
  return (
    <div className="min-h-screen bg-background-dark text-slate-100 font-display selection:bg-pink-500/30 selection:text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          <FilterSidebar categories={categories || []} brands={brands || []} />

          <div className="flex-1">
            <ProductGrid productsData={productsData} />
            <Pagination totalPages={totalPages} currentPage={currentPage} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
