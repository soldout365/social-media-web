import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Package,
  CreditCard,
  Settings,
  CheckCircle,
  Loader2,
} from "lucide-react";
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

// Menu item type
interface MenuItem {
  icon: typeof User;
  label: string;
  active: boolean;
}

interface DetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: TOrder | null;
  onUpdateStatus: (orderId: string, status: TOrderStatus) => void;
  getNextStatuses: (currentStatus: TOrderStatus) => TOrderStatus[];
  getStatusLabel: (status: TOrderStatus) => string;
  actionLoading: string | null;
}

export default function DetailDrawer({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  getNextStatuses,
  getStatusLabel,
  actionLoading,
}: DetailDrawerProps) {
  const menuItems: MenuItem[] = [
    { icon: User, label: "Chi tiết khách hàng", active: true },
    { icon: Package, label: "Danh mục sản phẩm", active: false },
    { icon: CreditCard, label: "Phân bổ chi phí", active: false },
    { icon: Settings, label: "Thao tác quản trị", active: false },
  ];

  if (!order) return null;

  const nextStatuses = getNextStatuses(order.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#111111]/30 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col border-l border-[#EAEAEA]"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#EAEAEA] flex items-center justify-between">
              <div>
                <h3 className="text-xl font-light tracking-tight text-[#111111]">
                  Xử lý đơn hàng
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#787774] mt-1">
                  Mã đơn: #{order._id.slice(-6).toUpperCase()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#F7F6F3] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {/* Order Status */}
              <div className="py-2">
                <StatusBadge status={order.status} />
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center gap-3 p-4 rounded-lg transition-all cursor-pointer ${
                      item.active
                        ? "bg-white text-[#111111] border border-[#EAEAEA]"
                        : "text-[#787774] hover:bg-[#F7F6F3]"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={item.active ? "text-[#111111]" : ""}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-widest">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-[#F7F6F3] rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-[#787774]">Tổng tiền:</span>
                  <span className="text-sm font-bold text-[#111111]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#787774]">Phương thức:</span>
                  <span className="text-sm text-[#111111]">
                    {order.paymentMethod === "vnpay" ? "VNPay" : "COD"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-[#787774]">Sản phẩm:</span>
                  <span className="text-sm text-[#111111]">
                    {order.products?.length || 0} sản phẩm
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                {/* Status Update Buttons */}
                {nextStatuses.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#787774]">
                      Cập nhật trạng thái
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {nextStatuses.map((status) => (
                        <motion.button
                          key={status}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={actionLoading === order._id}
                          onClick={() => onUpdateStatus(order._id, status)}
                          className="flex-1 py-3 px-4 rounded-lg font-medium text-sm bg-[#111111] text-white hover:bg-[#333333] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ fontFamily: FONTS.sans }}
                        >
                          {actionLoading === order._id ? (
                            <Loader2
                              size={16}
                              className="animate-spin mx-auto"
                            />
                          ) : status === "completed" ? (
                            <span className="flex items-center justify-center gap-1">
                              <CheckCircle size={14} /> {getStatusLabel(status)}
                            </span>
                          ) : (
                            getStatusLabel(status)
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cancel Reason (if cancelled) */}
                {order.status === "cancelled" && order.reasonCancel && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600">
                      Lý do hủy đơn
                    </p>
                    <p className="text-sm text-red-700">{order.reasonCancel}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
