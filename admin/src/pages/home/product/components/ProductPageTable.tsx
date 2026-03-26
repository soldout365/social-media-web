import { motion } from "framer-motion";
import { PencilSimple, Trash, ArrowClockwise } from "@phosphor-icons/react";
import type { TProduct } from "../../../types/product.type";

interface ProductPageTableProps {
  products: TProduct[];
  selectedIds: string[];
  isLoading: boolean;
  activeTab: "current" | "archive";
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEdit: (product: TProduct) => void;
  onSoftDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onHardDelete: (id: string) => void;
  onUpdateStatus: (id: string) => void;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const ProductPageTable: React.FC<ProductPageTableProps> = ({
  products,
  selectedIds,
  isLoading,
  activeTab,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onSoftDelete,
  onRestore,
  onHardDelete,
  onUpdateStatus,
}) => {
  return (
    <div className="flex-1 overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#EAEAEA] bg-[#F7F6F3]/50">
            <th className="pl-6 py-4 w-12">
              <input
                type="checkbox"
                checked={
                  selectedIds.length === products.length && products.length > 0
                }
                onChange={onToggleSelectAll}
                className="rounded border-[#EAEAEA] text-[#111111] focus:ring-[#111111]/20 cursor-pointer"
              />
            </th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-[#787774]">
              Sản phẩm
            </th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-[#787774]">
              SKU / ID
            </th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-[#787774]">
              Giá bán
            </th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-[#787774]">
              Tồn kho
            </th>
            <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-widest text-[#787774]">
              Trạng thái
            </th>
            <th className="pr-6 py-4 text-right text-[10px] font-bold uppercase tracking-widest text-[#787774]">
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
                Không có sản phẩm nào
              </td>
            </tr>
          ) : (
            products.map((product, index) => (
              <motion.tr
                key={product._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="hover:bg-[#F7F6F3]/40 transition-colors group"
              >
                <td className="pl-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product._id)}
                    onChange={() => onToggleSelect(product._id)}
                    className="rounded border-[#EAEAEA] text-[#111111] focus:ring-[#111111]/20 cursor-pointer"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="size-14 rounded-xl border border-[#EAEAEA] bg-[#F7F6F3] overflow-hidden shadow-sm">
                      <img
                        src={
                          product.images?.[0]?.url ||
                          "https://api.dicebear.com/7.x/shapes/svg?seed=product"
                        }
                        className="w-full h-full object-cover"
                        alt={product.nameProduct}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#111111]">
                        {product.nameProduct}
                      </p>
                      <p className="text-[11px] text-[#787774]">
                        {product.category?.nameCategory || "Chưa phân loại"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono text-[11px] text-[#787774] bg-[#F7F6F3] px-2.5 py-1 rounded">
                    {product._id.slice(-8)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="font-mono font-medium text-sm text-[#111111]">
                    {formatPrice(product.price)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-[#2F3437]">
                    {product.sizes?.reduce(
                      (sum, s) => sum + (s.quantity || 0),
                      0,
                    ) || 0}{" "}
                    sản phẩm
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => onUpdateStatus(product._id)}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className={`size-1.5 rounded-full ${product.status === "active" ? "bg-green-600" : "bg-[#787774]"}`}
                    ></div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-tight ${product.status === "active" ? "text-green-600" : "text-[#787774]"}`}
                    >
                      {product.status === "active" ? "Đang bán" : "Tạm ngưng"}
                    </span>
                  </button>
                </td>
                <td className="pr-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {activeTab === "current" ? (
                      <>
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2 rounded-lg border border-[#EAEAEA] bg-white text-[#787774] hover:text-[#111111] hover:border-[#111111]/20 transition-all"
                        >
                          <PencilSimple size={14} />
                        </button>
                        <button
                          onClick={() => onSoftDelete(product._id)}
                          className="p-2 rounded-lg border border-[#EAEAEA] bg-white text-[#787774] hover:text-[#9F2F2D] hover:border-[#9F2F2D]/30 transition-all"
                        >
                          <Trash size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => onRestore(product._id)}
                          className="p-2 rounded-lg border border-[#EAEAEA] bg-white text-[#787774] hover:text-[#111111] hover:border-[#111111]/20 transition-all"
                          title="Khôi phục"
                        >
                          <ArrowClockwise size={14} />
                        </button>
                        <button
                          onClick={() => onHardDelete(product._id)}
                          className="p-2 rounded-lg border border-[#EAEAEA] bg-white text-[#787774] hover:text-[#9F2F2D] hover:border-[#9F2F2D]/30 transition-all"
                          title="Xóa vĩnh viễn"
                        >
                          <Trash size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductPageTable;
