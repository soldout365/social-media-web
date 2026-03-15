import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function FilterSidebar({
  categories = [],
  brands = [],
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
}) {
  return (
    <aside className="w-full md:w-[260px] shrink-0">
      <div className="sticky top-28 space-y-10 bg-container-dark/40 border border-border-dark p-6 rounded-2xl shadow-lg">
        {/* Category Filter */}
        <div>
          <h3 className="font-bold mb-5 uppercase text-xs tracking-[0.2em] bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent">
            Danh mục
          </h3>
          <RadioGroup
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            className="gap-4"
          >
            {categories.map((cat) => (
              <label
                key={cat._id || cat.nameCategory}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <RadioGroupItem
                  value={cat.nameCategory}
                  className="w-5 h-5 border-2 border-border-dark text-pink-500 focus:ring-0 data-[state=checked]:border-pink-500 transition-all"
                />
                <span
                  className={`text-sm font-medium transition-colors ${
                    selectedCategory === cat.nameCategory
                      ? "text-white"
                      : "text-slate-400 group-hover:text-pink-300"
                  }`}
                >
                  {cat.nameCategory}
                </span>
              </label>
            ))}
          </RadioGroup>
        </div>

        {/* Brand Filter */}
        <div>
          <h3 className="font-bold mb-5 uppercase text-xs tracking-[0.2em] bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent">
            Thương hiệu
          </h3>
          <RadioGroup
            value={selectedBrand}
            onValueChange={setSelectedBrand}
            className="gap-4"
          >
            {brands.map((brand) => (
              <label
                key={brand._id || brand.nameBrand}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <RadioGroupItem
                  value={brand.nameBrand}
                  className="w-5 h-5 border-2 border-border-dark text-pink-500 focus:ring-0 data-[state=checked]:border-pink-500 transition-all"
                />
                <span
                  className={`text-sm font-medium transition-colors ${
                    selectedBrand === brand.nameBrand
                      ? "text-white"
                      : "text-slate-400 group-hover:text-pink-300"
                  }`}
                >
                  {brand.nameBrand}
                </span>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </aside>
  );
}
