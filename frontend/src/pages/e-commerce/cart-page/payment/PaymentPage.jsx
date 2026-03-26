import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateOrder } from "@/hooks/ecom/useOrder";
import { useDeleteProductInCart } from "@/hooks/ecom/useCart";
import { toast } from "react-hot-toast";

import ShippingInfoForm from "./components/ShippingInfoForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import OrderSummary from "./components/OrderSummary";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { mutation: deleteFromCart } = useDeleteProductInCart();

  const {
    selectedProducts = [],
    subtotal = 0,
    taxAmount = 0,
    totalAmount = 0,
    selectedVoucher = null,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });

  useEffect(() => {
    if (!location.state || selectedProducts.length === 0) {
      navigate("/cart");
      toast.warn("Vui lòng chọn sản phẩm trước khi thanh toán!");
    }
  }, [location.state, navigate, selectedProducts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = () => {

    if (
      !shippingInfo.name ||
      !shippingInfo.phone ||
      !shippingInfo.address ||
      !shippingInfo.email
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    const orderData = {
      products: selectedProducts.map((p) => ({
        productId: p.productId._id,
        quantity: p.quantity,
        size: p.size,
        color: p.color,
      })),
      voucher: selectedVoucher?._id || null,
      infoOrderShipping: {
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        email: shippingInfo.email,
      },
      paymentMethod,
      note: shippingInfo.note,
      priceShipping: 0, 
    };

    createOrder(orderData, {
      onSuccess: () => {

        const productIdsInCart = selectedProducts.map((p) => p._id);
        deleteFromCart.mutate(
          { productIdsInCart },
          {
            onSuccess: () => {

              navigate("/shopping");
            },
            onError: () => {

              navigate("/shopping");
            },
          },
        );
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div
      className="min-h-screen text-black antialiased"
      style={{
        fontFamily: '"Inter", sans-serif',
        backgroundColor: "#fafafa",
      }}
    >
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-6xl mx-auto px-4 py-8 lg:py-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <motion.section
            variants={itemVariants}
            className="lg:col-span-7 space-y-10"
          >
            <ShippingInfoForm
              shippingInfo={shippingInfo}
              handleInputChange={handleInputChange}
            />

            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </motion.section>

          <motion.aside variants={itemVariants} className="lg:col-span-5">
            <OrderSummary
              selectedProducts={selectedProducts}
              subtotal={subtotal}
              taxAmount={taxAmount}
              totalAmount={totalAmount}
              selectedVoucher={selectedVoucher}
              handleSubmitOrder={handleSubmitOrder}
              isPending={isPending}
            />
          </motion.aside>
        </div>
      </motion.main>

      <footer className="mt-12 py-8 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>© 2026 Vibe Flow Shop. All rights reserved.</p>
      </footer>
    </div>
  );
}
