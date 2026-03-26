import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreateOrder } from "@/hooks/ecom/useOrder";
import { useDeleteProductInCart } from "@/hooks/ecom/useCart";
import { toast } from "react-hot-toast";

// Sub-components
import ShippingInfoForm from "./components/ShippingInfoForm";
import PaymentMethodSelector from "./components/PaymentMethodSelector";
import OrderSummary from "./components/OrderSummary";

export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const { mutation: deleteFromCart } = useDeleteProductInCart();

  // Lấy dữ liệu từ CartSummarySidebar truyền sang
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

  // Chặn truy cập trực tiếp nếu không có sản phẩm
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
    // Validate thông tin cơ bản
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
      priceShipping: 0, // Miễn phí vận chuyển như đã hiển thị ở Cart
    };

    createOrder(orderData, {
      onSuccess: () => {
        // Sau khi đặt hàng thành công, xóa các sản phẩm này khỏi giỏ hàng
        const productIdsInCart = selectedProducts.map((p) => p._id);
        deleteFromCart.mutate(
          { productIdsInCart },
          {
            onSuccess: () => {
              // Sau khi xóa xong mới chuyển trang
              navigate("/shopping");
            },
            onError: () => {
              // Dù xóa ở cart bị lỗi vẫn nên chuyển trang vì đơn hàng đã tạo thành công ở backend
              navigate("/shopping");
            },
          },
        );
      },
    });
  };

  // Animations cho Framer Motion
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
