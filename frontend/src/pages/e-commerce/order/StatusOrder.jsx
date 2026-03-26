import React, { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import { useGetOrder, useCancelOrder } from "@/hooks/ecom/useOrder";

import OrderHeader from "./components/OrderHeader";
import OrderTabs from "./components/OrderTabs";
import OrderCard from "./components/OrderCard";
import EmptyOrderState from "./components/EmptyOrderState";

const TABS = [
  { id: "all", label: "Tất cả" },
  { id: "pending", label: "Chờ xác nhận" },
  { id: "confirmed", label: "Đã xác nhận" },
  { id: "delivery", label: "Đang giao" },
  { id: "completed", label: "Hoàn thành" },
  { id: "cancelled", label: "Đã hủy" },
];

export default function StatusOrder() {
  const { data: orderData, isLoading, refetch } = useGetOrder();
  const { mutate: cancelOrder } = useCancelOrder();
  const [activeTab, setActiveTab] = useState("all");

  const orders = useMemo(() => {
    return orderData?.data || [];
  }, [orderData]);

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (order) => activeTab === "all" || order.status === activeTab,
    );
  }, [orders, activeTab]);

  const handleCancelOrder = (orderId, message) => {
    cancelOrder(
      { orderId, body: { status: "cancelled", message } },
      {
        onSuccess: () => {
          refetch();
        },
      },
    );
  };

  return (
    <div
      className="min-h-screen py-10 px-4 text-zinc-900 antialiased"
      style={{
        fontFamily: '"Inter", sans-serif',
        backgroundColor: "#fcfafa",
      }}
    >
      <main className="max-w-4xl mx-auto">
        <OrderHeader />

        <OrderTabs
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="space-y-8">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-48 bg-white border border-zinc-100 rounded-3xl animate-pulse"
                  />
                ))}
              </div>
            ) : filteredOrders.length === 0 ? (
              <EmptyOrderState />
            ) : (
              filteredOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onCancel={handleCancelOrder}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
