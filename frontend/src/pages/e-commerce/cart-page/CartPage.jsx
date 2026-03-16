import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useGetCartByUser, useDeleteProductInCart } from "@/hooks/ecom/useCart";

import CartNavbar from "./components/CartNavbar";
import EmptyCartState from "./components/EmptyCartState";
import CartItemRow from "./components/CartItemRow";
import CartSummarySidebar from "./components/CartSummarySidebar";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const slideUpVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function CartPage() {
  const { query } = useGetCartByUser();
  const { mutation: deleteMutation } = useDeleteProductInCart();

  const cartData = query.data?.data || query.data || null;
  const products = cartData?.carts || [];
  
  const [selectedItemKeys, setSelectedItemKeys] = useState([]);

  // Calculate dynamic totals based on selected items
  const { totalQuantity, totalPrice } = useMemo(() => {
    let quantity = 0;
    let price = 0;
    products.forEach((item) => {
      const itemKey = `${item.productId._id}-${item.color}-${item.size}`;
      if (selectedItemKeys.includes(itemKey)) {
        quantity += item.quantity;
        const currentPrice = item.productId.price || 0;
        const currentSale = item.productId.sale || 0;
        const finalPrice = currentPrice * (1 - currentSale / 100);
        price += finalPrice * item.quantity;
      }
    });
    return { totalQuantity: quantity, totalPrice: price };
  }, [products, selectedItemKeys]);

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedItemKeys(products.map((p) => `${p.productId._id}-${p.color}-${p.size}`));
    } else {
      setSelectedItemKeys([]);
    }
  };

  const handleToggleSelect = (id, color, size) => {
    const key = `${id}-${color}-${size}`;
    setSelectedItemKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  const handleDeleteItem = (cartItemId) => {
    deleteMutation.mutate({ productIdsInCart: [cartItemId] });
    // Cleanup selection based on the custom keys if needed
  };

  const handleDeleteSelected = () => {
    if (selectedItemKeys.length === 0) return;
    
    // selectedItemKeys are in format `${productId}-${color}-${size}`
    // We need to find the specific cart item _ids that match these selected keys
    const idsToDelete = products
      .filter((item) => {
        const key = `${item.productId._id}-${item.color}-${item.size}`;
        return selectedItemKeys.includes(key);
      })
      .map(item => item._id);

    if (idsToDelete.length > 0) {
      deleteMutation.mutate({ productIdsInCart: idsToDelete });
    }
    setSelectedItemKeys([]);
  };

  const isAllSelected =
    products.length > 0 && selectedItemKeys.length === products.length;
  const isEmptyCart = products.length === 0 && !query.isLoading;

  return (
    <div className="bg-[#f8f6f6] dark:bg-[#1a1a1a] min-h-screen text-slate-900 dark:text-slate-100 pb-24 lg:pb-8 font-sans [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none][scrollbar-width:none]">
      <CartNavbar productCount={products.length} />

      <AnimatePresence>
        {isEmptyCart && <EmptyCartState />}
      </AnimatePresence>

      {!isEmptyCart && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex-1 space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={handleSelectAll}
                    id="select-all"
                    className="w-6 h-6 rounded-lg border-slate-300 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-300 data-[state=checked]:to-pink-500 data-[state=checked]:border-none transition-all"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-pink-500 transition-colors">
                    Chọn tất cả
                  </span>
                </label>
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedItemKeys.length === 0}
                  className="text-slate-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                  Xóa mục đã chọn
                </button>
              </motion.div>

              <div className="space-y-4">
                {products.map((item, index) => {
                  const itemKey = `${item.productId._id}-${item.color}-${item.size}`;
                  return (
                    <CartItemRow
                      key={`${itemKey}-${index}`}
                      item={item}
                      isSelected={selectedItemKeys.includes(itemKey)}
                      onToggleSelect={handleToggleSelect}
                      onDelete={handleDeleteItem}
                    />
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              variants={slideUpVariant}
              initial="hidden"
              animate="show"
              className="lg:w-[400px] shrink-0"
            >
              <CartSummarySidebar
                totalQuantity={totalQuantity}
                totalPrice={totalPrice}
                selectedCount={selectedItemKeys.length}
              />
            </motion.div>
          </div>
        </main>
      )}

      {/* MOBILE CHECKOUT FOOTER */}
      {!isEmptyCart && (
        <footer className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] border-t border-slate-200 dark:border-slate-800 px-6 py-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-bold uppercase">
                Tổng thanh toán
              </span>
              <span className="text-lg font-black bg-gradient-to-r from-yellow-400 to-pink-600 bg-clip-text text-transparent leading-none">
                {totalPrice.toLocaleString("vi-VN")} VND
              </span>
            </div>
            <Button
              disabled={selectedItemKeys.length === 0}
              className="flex-1 disabled:opacity-50 max-w-[200px] h-auto bg-gradient-to-r from-yellow-300 to-pink-500 text-white py-4 rounded-full font-bold shadow-lg shadow-pink-500/20 border-none hover:opacity-90 transition-opacity"
            >
              Thanh toán
            </Button>
          </div>
        </footer>
      )}
    </div>
  );
}
