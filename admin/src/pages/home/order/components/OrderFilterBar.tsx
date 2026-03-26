import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { FONTS } from "../../dashboard/components/theme";
import type { TOrderStatus } from "../../../../types/order.type";

// Order status type for filter
type FilterStatus = "all" | TOrderStatus;

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active
          ? "bg-[#111111] text-white"
          : "bg-white border border-[#EAEAEA] text-[#787774] hover:text-[#111111] hover:border-[#111111]/20"
      }`}
      style={{ fontFamily: FONTS.sans }}
    >
      {label}
    </button>
  );
}

interface OrderFilterBarProps {
  filters: { label: string; value: FilterStatus }[];
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  searchQuery: string;
  onSearch: (value: string) => void;
}

export default function OrderFilterBar({
  filters,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearch,
}: OrderFilterBarProps) {
  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4"
      >
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <FilterButton
              key={filter.value}
              label={filter.label}
              active={activeFilter === filter.value}
              onClick={() => onFilterChange(filter.value)}
            />
          ))}
        </div>

        {/* Search Input */}
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#787774]"
          />
          <input
            className="pl-10 pr-4 py-2 bg-white border border-[#EAEAEA] rounded-lg text-sm w-full md:w-64 focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/10 outline-none transition-all text-[#111111] placeholder:text-[#ABABAB]"
            placeholder="Tìm mã đơn, khách hàng..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
            style={{ fontFamily: FONTS.sans }}
          />
        </div>
      </motion.div>
    </section>
  );
}
