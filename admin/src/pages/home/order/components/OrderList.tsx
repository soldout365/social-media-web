import { motion, AnimatePresence } from "framer-motion";
import { Package } from "lucide-react";
import { FONTS } from "../../dashboard/components/theme";
import type { TOrder, TOrderStatus } from "../../../../types/order.type";

// Helper to format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Status badge component
interface StatusBadgeProps {
  status: TOrderStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<
    TOrderStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    pending: {
      label: "Chờ xác nhận",
      bg: "#f4f3f3",
      text: "#5a5c5c",
      border: "#adb3b2",
    },
    confirmed: {
      label: "Đã xác nhận",
      bg: "#e4e1e6",
      text: "#525155",
      border: "#adb3b2",
    },
    delivery: {
      label: "Đang giao",
      bg: "#d3e4fe",
      text: "#435368",
      border: "#adb3b2",
    },
    completed: {
      label: "Hoàn thành",
      bg: "#d6d3d7",
      text: "#525155",
      border: "#adb3b2",
    },
    cancelled: {
      label: "Đã hủy",
      bg: "#fe8983",
      text: "#752121",
      border: "#adb3b2",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider rounded border"
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: `${config.border}33`,
      }}
    >
      {config.label}
    </span>
  );
}

// Order row component
interface OrderRowProps {
  order: TOrder;
  onClick: () => void;
}

function OrderRow({ order, onClick }: OrderRowProps) {
  const getPaymentStatus = () => {
    if (order.paymentMethod === "vnpay") {
      return "VNPay • ĐÃ THANH TOÁN";
    }
    return `COD • ${order.status === "completed" ? "ĐÃ NHẬN" : "CHƯA THANH TOÁN"}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`p-1 rounded-xl bg-white border border-[#EAEAEA] hover:border-[#111111]/20 transition-all duration-300 cursor-pointer group ${
        order.status === "cancelled" ? "opacity-60" : ""
      }`}
    >
      <div
        className="bg-[#F7F6F3] rounded-lg p-4 flex flex-col md:flex-row items-center gap-6"
        style={{ fontFamily: FONTS.mono }}
      >
        {/* Order ID */}
        <div className="flex-shrink-0 w-full md:w-32">
          <p className="text-[10px] uppercase tracking-widest text-[#787774] mb-1">
            Mã đơn hàng
          </p>
          <p className="text-sm font-semibold text-[#111111]">
            #{order._id.slice(-6).toUpperCase()}
          </p>
        </div>

        {/* Customer */}
        <div className="flex-grow">
          <p className="text-[10px] uppercase tracking-widest text-[#787774] mb-1">
            Khách hàng
          </p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-[#111111]">
              {order.infoOrderShipping?.name || "Khách hàng"}
            </span>
            <span className="text-xs text-[#787774]">
              {order.infoOrderShipping?.phone || ""}
            </span>
          </div>
        </div>

        {/* Payment */}
        <div className="flex-shrink-0 w-full md:w-40">
          <p className="text-[10px] uppercase tracking-widest text-[#787774] mb-1">
            Thanh toán
          </p>
          <p className="text-sm font-bold text-[#111111]">
            {formatCurrency(order.total)}
          </p>
          <p className="text-[10px] text-[#787774]">{getPaymentStatus()}</p>
        </div>

        {/* Assigned */}
        <div className="flex-shrink-0 w-full md:w-40">
          <p className="text-[10px] uppercase tracking-widest text-[#787774] mb-1">
            Phân công
          </p>
          {order.assignee ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#EAEAEA] flex items-center justify-center">
                <span className="text-[10px] font-bold text-[#111111]">
                  {(order.assignee.fullname || "")
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-medium text-[#111111]">
                {order.assignee.fullname}
              </span>
            </div>
          ) : (
            <span className="text-xs font-medium text-[#787774] italic">
              Chưa phân công
            </span>
          )}
        </div>

        {/* Status */}
        <div className="flex-shrink-0 w-full md:w-32">
          <StatusBadge status={order.status} />
        </div>

        {/* Chevron */}
        <motion.div className="flex-shrink-0 text-[#787774] group-hover:translate-x-1 transition-transform">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Loading skeleton component
function OrderRowSkeleton() {
  return (
    <div className="p-1 rounded-xl bg-white border border-[#EAEAEA]">
      <div className="bg-[#F7F6F3] rounded-lg p-4 flex flex-col md:flex-row items-center gap-6 animate-pulse">
        <div className="flex-shrink-0 w-full md:w-32">
          <div className="h-3 w-20 bg-[#EAEAEA] rounded mb-1" />
          <div className="h-4 w-24 bg-[#EAEAEA] rounded" />
        </div>
        <div className="flex-grow">
          <div className="h-3 w-16 bg-[#EAEAEA] rounded mb-1" />
          <div className="h-4 w-32 bg-[#EAEAEA] rounded" />
        </div>
        <div className="flex-shrink-0 w-full md:w-40">
          <div className="h-3 w-20 bg-[#EAEAEA] rounded mb-1" />
          <div className="h-4 w-28 bg-[#EAEAEA] rounded" />
        </div>
        <div className="flex-shrink-0 w-full md:w-40">
          <div className="h-3 w-16 bg-[#EAEAEA] rounded mb-1" />
          <div className="h-4 w-24 bg-[#EAEAEA] rounded" />
        </div>
        <div className="flex-shrink-0 w-full md:w-32">
          <div className="h-6 w-20 bg-[#EAEAEA] rounded" />
        </div>
      </div>
    </div>
  );
}

// Error message component
function OrderError({ message }: { message: string }) {
  return (
    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-600">{message}</p>
    </div>
  );
}

// Empty state component
function OrderEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-12"
    >
      <Package size={48} className="mx-auto text-[#EAEAEA] mb-4" />
      <p className="text-[#787774]">Không tìm thấy đơn hàng nào</p>
    </motion.div>
  );
}

interface OrderListProps {
  orders: TOrder[];
  isLoading: boolean;
  error: Error | null;
  onOrderClick: (order: TOrder) => void;
}

export default function OrderList({
  orders,
  isLoading,
  error,
  onOrderClick,
}: OrderListProps) {
  return (
    <>
      {/* Error State */}
      {error && (
        <OrderError message={`Lỗi khi tải đơn hàng: ${error.message}`} />
      )}

      {/* Order Rows Ledger */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <OrderRowSkeleton />
              </motion.div>
            ))
          ) : orders.length === 0 ? (
            <OrderEmpty />
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={order._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <OrderRow order={order} onClick={() => onOrderClick(order)} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
