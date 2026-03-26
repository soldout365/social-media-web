import { motion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface ProductPagePaginationProps {
  page: number;
  totalPages: number;
  totalDocs: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const ProductPagePagination: React.FC<ProductPagePaginationProps> = ({
  page,
  totalPages,
  totalDocs,
  limit,
  onPageChange,
}) => {
  const startDoc = (page - 1) * limit + 1;
  const endDoc = Math.min(page * limit, totalDocs);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="px-6 py-5 border-t border-[#EAEAEA] flex items-center justify-between bg-[#F7F6F3]/30"
    >
      <p className="text-xs text-[#787774]">
        Hiển thị{" "}
        <span className="font-bold text-[#111111]">
          {startDoc} - {endDoc}
        </span>{" "}
        trong số <span className="font-bold text-[#111111]">{totalDocs}</span>{" "}
        sản phẩm
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="size-9 flex items-center justify-center rounded-lg border border-[#EAEAEA] text-[#ABABAB] hover:bg-[#F7F6F3] hover:text-[#111111] transition-colors disabled:opacity-20"
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (p: number) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`size-9 flex items-center justify-center rounded-lg font-bold text-xs transition-all ${p === page ? "bg-[#111111] text-white border-[#111111]" : "border border-[#EAEAEA] text-[#787774] hover:bg-white hover:text-[#111111]"}`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="size-9 flex items-center justify-center rounded-lg border border-[#EAEAEA] text-[#ABABAB] hover:bg-[#F7F6F3] hover:text-[#111111] transition-colors disabled:opacity-20"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductPagePagination;
