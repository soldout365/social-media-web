"use client";

import React, { useState } from "react";
import { useGetAllCategories } from "@/hooks/ecom/useCategory";
import { useGetAllBrands } from "@/hooks/ecom/useBrand";

import Header from "./components/Header";
import FilterSidebar from "./components/FilterSidebar";
import ProductGrid from "./components/ProductGrid";
import Pagination from "./components/Pagination";
import Footer from "./components/Footer";

// --- MOCK DATA ---

const products = [
  {
    id: 1,
    name: "Vô lăng Carbon Fiber",
    category: "Nội thất cao cấp",
    price: "12.500.000",
    oldPrice: "15.000.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBNjXkEoKuMsgKgA-uOSB1kCw-s4L5GOWY7lPU_fa-DKBbBjA2pLeRx_Pa9BwGiAQ587tN69vg_oNwSuAvOtOuTRJb5MNTB9X816sSBgHkR2MSQ093IxDkprRnnQs0mL4YF1JLSbEFzZ2JseXN3RXqUzAJpWGV4QBAl2DPrc61XgyXtyf4Lf9Nt0ZwwaGMA-2MKBR9YAAdBTEOdmUQJcyRGoEYzrk0enFc6jVDC4ZXmx3sk24qZ4O74H6cbPSEqeRpYAwDGwN40g_67",
    hot: true,
  },
  {
    id: 2,
    name: "Ốp gương Carbon 3K",
    category: "Ngoại thất",
    price: "3.200.000",
    oldPrice: "4.500.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBE_xMCPz6RZ9Mis48YEBuv_6ZJg6DC-bFagT7L6NDUjOUxMWW_FPdXuAv4mp1D2t_RJiO3nW4GJL0zxylqJiyuVtaJmOLZypdfqEkliDsbB39_035M2iOHXrXYw1H4xicE0PSdDH782P166K8ggMtPSqDrXydW9MlAn_rRXl5r5E5DOWBc8YnOlhg7ygrbU3EVoqDttnjarKfYev0nM-iKoTwGC8hna0mvqy5iISoFiYrVBhmDleKTwTTfx5aZZQXhW50gpyXE74jX",
    hot: false,
  },
  {
    id: 3,
    name: "Mâm đúc Forged Wheels",
    category: "Phụ tùng Michelin",
    price: "45.000.000",
    oldPrice: "52.000.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC99MW3mnVjDktK2_gxoiH_3b5d4uKmUMRz3_YySDwKUdI5EgoVjaZFnzZJXbr_B6kxBQMjmdMbE2WVZDDYhbFbe4veXn7WEASa8K_9j-2RNyJv6EN533aY6otU3hpO4QleyNollUN3nrXE5qB4RL5vJMEcEBmC9YFv1tBgsCiq0_a8ASCT3FVwO3E6b8Lw2wRlJBYMU_qPZnyoBVxvm0SrYn_Dx123GUuKta7v91qdGuvZQidpTnz-YizOkXsY8DP33kgYdBMaW5Wr",
    hot: false,
  },
  {
    id: 4,
    name: "Bộ phanh Brembo GT S",
    category: "Hiệu năng Brembo",
    price: "88.000.000",
    oldPrice: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBF3L40xTpjbNNo8kdxmNDRSujV8Q-sktyFqH1XBRvdyhXEYjKWeEGwHkmRrKqcK4Z-rVn3xBQeWp3u9ssl5DG5Dcc3CooNOptvXjBWau9ikTAhJf2N7ddEqkx_txT6FrUQQTMKDLpLSmXEtAE1hn6St8bpGEcu-_3j3kRQt7l5mxOL8LL7KtXK5zyycP0e6Jqq6J9rzwLoydLu42kZige-ju7tQwbf-62slaCA7QkaUOQJOg4Z1W7S69jrLmVDsjCw5XxkI_dvoBtZ",
    hot: false,
  },
  {
    id: 5,
    name: "Ống xả Akrapovic Slip-On",
    category: "Âm thanh Akrapovic",
    price: "32.900.000",
    oldPrice: "38.000.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2wC_VVQxZB-7LHn0Lb8EYy0OpjCQuwm0iyH7LxuVUh4_DPOosdVQQnYvowdayGiSDJu_oUNs4wvv-8WqPAvTdUt-a9xxbWalPYq5trmPxjT3YbO4Auuwskk0i3ADUTamiyXygSa5h-2UKUf_6SZf6EMGQIUMN4KsoP5dctEjPmgc0q9193UszXTki_uIZXc4B9g6o83KjN1UhZm6Tin-5eYGHBAwFiOr00VNF7piBPwHVA1qt7wNDCigl7nrwI_23sROD80pHG9d8",
    hot: false,
  },
  {
    id: 6,
    name: "Đèn LED Nội Thất Ambient",
    category: "Đèn LED",
    price: "5.500.000",
    oldPrice: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDmynS2yVr6Y8sqt4kn0iIyos4Oy-A0VvvP6WaL-WxOXMZkZSP0gDFsU4qHfK0GUnS2CVzA1N5JAidAD8exS8H5hbdZQdU-0RWQcUsFLH7Tw1wKC8X0HE_zsg0BhFU-wTE4XuRIRps-Gb8CW-jdPP6sBGX-r6VEYtdWQZC_3lnKIEbAl_-iMDXAIZEJid-uw0FKd6SHxjA96Y-447EbflfiFXka_dvxJbz6qm5PK7HxP0CHLjg0wigZXDkETsBLLqE4GGl3E7OsmHIK",
    hot: false,
  },
  {
    id: 7,
    name: "Thảm Lót Sàn Da 6D",
    category: "Nội thất",
    price: "1.800.000",
    oldPrice: "2.400.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC8R0MZ72fwZRU8Q0vBXlUniMVeTaSif0ybbSlqZ8eMB1Jw0luF-REngxTIweoDsnSIUrSbAM42klhex_P6BCiCVHCLO6kHriK245rhAMhtFtC9bOfVHft9uUgiDFHEYViOQW6JJLOksnsCjTkDlIQzWXpvFT4BsrK27fTqvydJPanhfGyjBSdBWNh1ivHD2qRrK6tZtIA8-JsEskJ0_XQm4z1dM4wCqEwy77xxX2MFjTSAnRTb3InOxwCKgoEQPw6F5aZZcSVEQB-M",
    hot: false,
  },
  {
    id: 8,
    name: "Lốp Michelin Pilot Sport 5",
    category: "Michelin Performance",
    price: "7.200.000",
    oldPrice: null,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWi9HaJj2XPe7ZcyAq8_xDWzdV72b-lcFroom2PDn0IrFutdK9jXJcmOc-iHy_WdHKVwhqOyjx8c-ygytL8VxswYCY5YDbPqHi-Aa8TQex1p3F0WUcH8OjJp80DTHLa29CLZznZ_lcTUewjsKlhaON3mUV3-O9XIK8fWzYdbaLiRPMJglEJCuqBoOHfrvF77OxlNkq4p77QTI7Op3tE4cS5nYo-vwfb2jdrd68cjD7EZ0HuytyGqPNXwX5rKJIkx1TB4gOis6bdXYb",
    hot: false,
  },
];

export default function LuxeAutoPage() {
  const { data: categoriesData } = useGetAllCategories();
  const categories = categoriesData?.data?.filter(
    (category) => category.status === "active"
  );

  console.log(categories, "nảuti");
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
            <ProductGrid products={products} />
            <Pagination />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
