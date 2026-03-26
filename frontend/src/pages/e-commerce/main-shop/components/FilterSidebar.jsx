import React from "react";
import { useSearchParams, createSearchParams } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function FilterSidebar({ categories = [], brands = [] }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";
  const selectedBrand = searchParams.get("brand") || "all";

  const handleFilterChange = (key, value) => {
    const params = Object.fromEntries(searchParams);
    if (value === "all") {
      delete params[key];
    } else {
      params[key] = value;
    }

    if (params._page) params._page = 1;

    setSearchParams(createSearchParams(params), { replace: true });
  };
  return (
    <aside className="w-full md:w-[260px] shrink-0">
      <div className="sticky top-28 space-y-10 bg-container-dark/40 border border-border-dark p-6 rounded-2xl shadow-lg">
        {}
        <div>
          <h3 className="font-bold mb-5 uppercase text-base  bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent">
            Danh mục
          </h3>
          <RadioGroup
            value={selectedCategory}
            onValueChange={(val) => handleFilterChange("category", val)}
            className="gap-4"
          >
            {}
            <label className="flex items-center gap-3 cursor-pointer group">
              <RadioGroupItem
                value="all"
                className="w-5 h-5 border-2 border-border-dark text-white focus:ring-0 data-[state=checked]:border-white transition-all"
              />
              <span
                className={`text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "text-white"
                    : "text-slate-400 group-hover:text-pink-300"
                }`}
              >
                Tất cả danh mục
              </span>
            </label>

            {categories.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <RadioGroupItem
                  value={cat._id}
                  className="w-5 h-5 border-2 border-border-dark text-white focus:ring-0 data-[state=checked]:border-white transition-all"
                />
                <span
                  className={`text-sm font-medium transition-colors ${
                    selectedCategory === cat._id
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

        {}
        <div>
          <h3 className=" font-bold mb-5 uppercase text-base bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent">
            Thương hiệu
          </h3>
          <RadioGroup
            value={selectedBrand}
            onValueChange={(val) => handleFilterChange("brand", val)}
            className="gap-4"
          >
            {}
            <label className="flex items-center gap-3 cursor-pointer group">
              <RadioGroupItem
                value="all"
                className="w-5 h-5 border-2 border-border-dark text-white focus:ring-0 data-[state=checked]:border-white transition-all"
              />
              <span
                className={`text-sm font-medium transition-colors ${
                  selectedBrand === "all"
                    ? "text-white"
                    : "text-slate-400 group-hover:text-pink-300"
                }`}
              >
                Tất cả thương hiệu
              </span>
            </label>

            {brands.map((brand) => (
              <label
                key={brand._id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <RadioGroupItem
                  value={brand._id}
                  className="w-5 h-5 border-2 border-border-dark text-white focus:ring-0 data-[state=checked]:border-white transition-all"
                />
                <span
                  className={`text-sm font-medium transition-colors ${
                    selectedBrand === brand._id
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
