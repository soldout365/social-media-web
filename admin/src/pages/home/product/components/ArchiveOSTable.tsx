import { motion } from "framer-motion";
import { ArrowClockwise, Trash } from "@phosphor-icons/react";
import type { TProduct } from "../../../types/product.type";

interface ArchiveOSTableProps {
  products: TProduct[];
  selectedIds: string[];
  isLoading: boolean;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onRestore: (id: string) => void;
  onHardDelete: (id: string) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const ArchiveOSTable: React.FC<ArchiveOSTableProps> = ({
  products,
  selectedIds,
  isLoading,
  onToggleSelect,
  onToggleSelectAll,
  onRestore,
  onHardDelete,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="p-1.5 bg-[#EAEAEA]/30 rounded-3xl border border-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
    >
      <div className="bg-white border border-[#EAEAEA] rounded-[1.5rem] overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[#EAEAEA] bg-[#F7F6F3]/50">
              <th className="p-4 text-left w-12">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === products.length &&
                    products.length > 0
                  }
                  onChange={onToggleSelectAll}
                  className="rounded border-[#EAEAEA] text-[#111111] focus:ring-[#111111]/20 cursor-pointer"
                />
              </th>
              <th className="p-4 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-[#787774]">
                Hình ảnh
              </th>
              <th className="p-4 text-left text-[10px] uppercase tracking-[0.2em] font-bold text-[#787774]">
                Sản phẩm
              </th>
              <th className="p-4 text-left text-[10px] uppercase tracking-[0.2em] font-bold text-[#787774]">
                Mã SKU
              </th>
              <th className="p-4 text-left text-[10px] uppercase tracking-[0.2em] font-bold text-[#787774]">
                Ngày xóa
              </th>
              <th className="p-4 text-right text-[10px] uppercase tracking-[0.2em] font-bold text-[#787774]">
                Giá trị
              </th>
              <th className="p-4 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-[#787774]">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAEAEA]/50">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#787774]">
                  Đang tải...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#787774]">
                  Không có sản phẩm nào trong thùng rác
                </td>
              </tr>
            ) : (
              products.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.5 + index * 0.08,
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group hover:bg-[#F7F6F3]/40 transition-colors"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item._id)}
                      onChange={() => onToggleSelect(item._id)}
                      className="rounded border-[#EAEAEA] text-[#111111] focus:ring-[#111111]/20 cursor-pointer"
                    />
                  </td>
                  <td className="p-4">
                    <div className="w-12 h-12 bg-[#F7F6F3] rounded-lg border border-[#EAEAEA] overflow-hidden mx-auto">
                      <img
                        src={
                          item.images?.[0]?.url ||
                          "https://api.dicebear.com/7.x/shapes/svg?seed=product"
                        }
                        className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                        alt="product"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-[#111111]">
                      {item.nameProduct}
                    </div>
                    <div className="text-[10px] text-[#787774] font-bold uppercase tracking-wider">
                      {item.category?.nameCategory || "Chưa phân loại"}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-[#787774]">
                    {item._id.slice(-8)}
                  </td>
                  <td className="p-4 font-mono text-xs text-[#787774]">
                    {formatDate(item.updatedAt)}
                  </td>
                  <td className="p-4 text-right font-mono font-medium text-[#111111]">
                    {formatPrice(item.price)}
                    <span className="text-[9px] text-[#787774] ml-1">VND</span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onRestore(item._id)}
                        className="p-2 text-[#787774] hover:text-[#111111] hover:bg-[#F7F6F3] rounded-lg transition-all"
                        title="Khôi phục"
                      >
                        <ArrowClockwise size={16} />
                      </button>
                      <button
                        onClick={() => onHardDelete(item._id)}
                        className="p-2 text-[#787774] hover:text-[#9F2F2D] hover:bg-[#FDEBEC] rounded-lg transition-all"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ArchiveOSTable;
