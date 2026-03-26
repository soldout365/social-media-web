import { useState, useMemo } from "react";
import { useGetAllOrders, useUpdateOrder } from "../../../hooks/useOrder";
import type { TOrder, TOrderStatus } from "../../../types/order.type";
import {
  OrderHeader,
  OrderFilterBar,
  OrderList,
  OrderPagination,
  DetailDrawer,
} from "./components";

// Order status type for filter
type FilterStatus = "all" | TOrderStatus;

const filters: { label: string; value: FilterStatus }[] = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xác nhận", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang giao", value: "delivery" },
  { label: "Hoàn thành", value: "completed" },
  { label: "Đã hủy", value: "cancelled" },
];

// Main Order component
export default function OrderPage() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const limit = 10;

  // Mutations
  const updateOrderMutation = useUpdateOrder();

  // Build query params
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = {
      _page: page,
      _limit: limit,
    };

    if (activeFilter !== "all") {
      params.status = activeFilter;
    }

    if (searchQuery.trim()) {
      params.q = searchQuery.trim();
    }

    return params;
  }, [activeFilter, searchQuery, page]);

  // Fetch orders from API
  const { data, isLoading, error } = useGetAllOrders(queryParams);

  const orders = data?.docs || [];
  const totalDocs = data?.totalDocs || 0;
  const totalPages = data?.totalPages || 1;

  // Handle filter change
  const handleFilterChange = (filter: FilterStatus) => {
    setActiveFilter(filter);
    setPage(1); // Reset to first page when filter changes
  };

  // Handle search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset to first page when search changes
  };

  // Get selected order from list
  const selectedOrderData = selectedOrder
    ? orders.find((o) => o._id === selectedOrder._id) || null
    : null;

  // Handle update order status
  const handleUpdateStatus = async (orderId: string, status: TOrderStatus) => {
    setActionLoading(orderId);
    try {
      await updateOrderMutation.mutateAsync({ orderId, status });
      setSelectedOrder(null);
    } catch (error: unknown) {
      console.error("Failed to update order status:", error);
      // Extract error message from response
      const err = error as { response?: { data?: { message?: string } } };
      const message = err?.response?.data?.message || "Có lỗi xảy ra";
      alert(message);
    } finally {
      setActionLoading(null);
    }
  };

  // Available status transitions based on current status
  const getNextStatuses = (currentStatus: TOrderStatus): TOrderStatus[] => {
    const transitions: Record<TOrderStatus, TOrderStatus[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["delivery", "cancelled"],
      delivery: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };
    return transitions[currentStatus] || [];
  };

  // Get status label
  const getStatusLabel = (status: TOrderStatus): string => {
    const labels: Record<TOrderStatus, string> = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      delivery: "Đang giao",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
    };
    return labels[status];
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <main className="pt-24 pb-12 px-6 max-w-screen-xl mx-auto">
      {/* Header Section */}
      <OrderHeader
        title="Trung tâm Xử lý Đơn hàng"
        description="Theo dõi và điều phối vận chuyển hệ thống thời gian thực."
      />

      {/* Functional Controls & Filters */}
      <OrderFilterBar
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      {/* Order List */}
      <OrderList
        orders={orders}
        isLoading={isLoading}
        error={error}
        onOrderClick={setSelectedOrder}
      />

      {/* Footer / Pagination */}
      <OrderPagination
        page={page}
        totalPages={totalPages}
        totalDocs={totalDocs}
        ordersLength={orders.length}
        isLoading={isLoading}
        onPageChange={handlePageChange}
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrderData}
        onUpdateStatus={handleUpdateStatus}
        getNextStatuses={getNextStatuses}
        getStatusLabel={getStatusLabel}
        actionLoading={actionLoading}
      />
    </main>
  );
}
