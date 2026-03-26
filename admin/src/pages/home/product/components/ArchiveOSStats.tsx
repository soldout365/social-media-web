import { motion } from "framer-motion";
import { Package, TrendUp, HardDrive, Calendar } from "@phosphor-icons/react";

interface ArchiveOSStatsProps {
  totalDocs: number;
  totalValue: number;
  totalStock: number;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const ArchiveOSStats: React.FC<ArchiveOSStatsProps> = ({
  totalDocs,
  totalValue,
  totalStock,
}) => {
  const stats = [
    {
      label: "Tổng mục lưu trữ",
      value: totalDocs.toString(),
      change: "+0",
      icon: <Package size={14} weight="bold" />,
    },
    {
      label: "Giá trị tồn kho lưu",
      value: formatPrice(totalValue),
      icon: <TrendUp size={14} weight="bold" />,
    },
    {
      label: "Số lượng sản phẩm",
      value: totalStock.toString(),
      sub: "SP",
      icon: <HardDrive size={14} weight="bold" />,
    },
    {
      label: "Tự động xóa sau",
      value: "30",
      sub: "NGÀY",
      icon: <Calendar size={14} weight="bold" />,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.08,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="p-6 border border-[#EAEAEA] bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[#787774]">{stat.icon}</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#787774]">
              {stat.label}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-light font-mono tracking-tighter text-[#111111]">
              {stat.value}
            </span>
            {stat.change ? (
              <span className="text-[#111111] text-xs font-mono font-bold">
                {stat.change}
              </span>
            ) : (
              <span className="text-[#787774] text-[10px] font-bold uppercase">
                {stat.sub}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ArchiveOSStats;
