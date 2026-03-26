import { motion } from "framer-motion";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

interface ArchiveOSPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ArchiveOSPagination: React.FC<ArchiveOSPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="flex flex-col sm:flex-row items-center justify-between pt-4 gap-4"
    >
      <span className="text-[10px] text-[#787774] font-bold uppercase tracking-[0.2em]">
        Trang {page} / {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center border border-[#EAEAEA] rounded-lg hover:bg-white transition-all disabled:opacity-20"
        >
          <CaretLeft size={16} weight="bold" />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
          (p: number) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center border text-xs font-mono font-bold rounded-lg transition-all ${p === page ? "bg-[#111111] text-white border-[#111111] shadow-lg shadow-[#111111]/20" : "border-[#EAEAEA] text-[#787774] hover:bg-white hover:text-[#111111]"}`}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center border border-[#EAEAEA] rounded-lg hover:bg-white transition-all disabled:opacity-20 text-[#787774] hover:text-[#111111]"
        >
          <CaretRight size={16} weight="bold" />
        </button>
      </div>
    </motion.div>
  );
};

export default ArchiveOSPagination;
