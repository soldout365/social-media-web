import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrderPaginationProps {
  page: number;
  totalPages: number;
  totalDocs: number;
  ordersLength: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
}

export default function OrderPagination({
  page,
  totalPages,
  totalDocs,
  ordersLength,
  isLoading,
  onPageChange,
}: OrderPaginationProps) {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mt-12 flex items-center justify-between border-t border-[#EAEAEA] pt-6"
    >
      <span className="text-xs font-mono text-[#787774] uppercase tracking-widest">
        {isLoading ? (
          "Đang tải..."
        ) : (
          <>
            Hiển thị {ordersLength} của {totalDocs} đơn hàng
          </>
        )}
      </span>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={page === 1 || isLoading}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="size-9 flex items-center justify-center rounded-lg border border-[#EAEAEA] text-[#ABABAB] hover:bg-[#F7F6F3] hover:text-[#111111] transition-colors disabled:opacity-20"
        >
          <ChevronLeft size={18} />
        </motion.button>
        <div className="flex items-center px-4 font-mono text-sm text-[#111111] font-bold">
          Trang {page} / {totalPages}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={page >= totalPages || isLoading}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="size-9 flex items-center justify-center rounded-lg border border-[#EAEAEA] text-[#ABABAB] hover:bg-[#F7F6F3] hover:text-[#111111] transition-colors disabled:opacity-20"
        >
          <ChevronRight size={18} />
        </motion.button>
      </div>
    </motion.footer>
  );
}
