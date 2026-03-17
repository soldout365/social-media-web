import React from "react";
import { motion } from "framer-motion";
import { Truck, Check, CreditCard } from "lucide-react";

export default function PaymentMethodSelector({ paymentMethod, setPaymentMethod }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Phương thức thanh toán</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* COD Option */}
        <label className="relative cursor-pointer">
          <input
            className="sr-only"
            name="payment"
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          <motion.div
            animate={{
              borderColor: paymentMethod === "cod" ? "#ec4899" : "#f3f4f6", // pink-500
              backgroundColor: paymentMethod === "cod" ? "#fff5f7" : "#fff",
              scale: paymentMethod === "cod" ? 1.02 : 1,
            }}
            className="p-5 border-2 rounded-2xl flex flex-col gap-3 transition-all hover:border-pink-200 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-xl transition-colors ${
                paymentMethod === "cod" 
                  ? "bg-gradient-to-br from-yellow-400 to-pink-500 text-white shadow-lg shadow-pink-500/20" 
                  : "bg-gray-100 text-gray-400"
              }`}>
                <Truck size={20} strokeWidth={2.5} />
              </div>
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                  paymentMethod === "cod"
                    ? "bg-pink-500 border-pink-500 shadow-sm"
                    : "border-2 border-gray-200"
                }`}
              >
                {paymentMethod === "cod" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={14} stroke="white" strokeWidth={4} />
                  </motion.div>
                )}
              </div>
            </div>
            <div>
              <p className={`font-bold transition-colors ${paymentMethod === "cod" ? "text-pink-600" : "text-gray-900"}`}>
                Thanh toán khi nhận hàng (COD)
              </p>
              <p className="text-sm text-gray-500 font-medium">
                Thanh toán bằng tiền mặt khi shipper giao tới.
              </p>
            </div>
          </motion.div>
        </label>

        {/* VNPay Option */}
        <label className="relative cursor-pointer">
          <input
            className="sr-only"
            name="payment"
            type="radio"
            value="vnpay"
            checked={paymentMethod === "vnpay"}
            onChange={() => setPaymentMethod("vnpay")}
          />
          <motion.div
            animate={{
              borderColor: paymentMethod === "vnpay" ? "#ec4899" : "#f3f4f6",
              backgroundColor: paymentMethod === "vnpay" ? "#fff5f7" : "#fff",
              scale: paymentMethod === "vnpay" ? 1.02 : 1,
            }}
            className="p-5 border-2 rounded-2xl flex flex-col gap-3 transition-all hover:border-pink-200 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className={`p-2 rounded-xl transition-colors ${
                paymentMethod === "vnpay" 
                  ? "bg-gradient-to-br from-yellow-400 to-pink-500 text-white shadow-lg shadow-pink-500/20" 
                  : "bg-gray-100 text-gray-400"
              }`}>
                <CreditCard size={20} strokeWidth={2.5} />
              </div>
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center transition-all ${
                  paymentMethod === "vnpay"
                    ? "bg-pink-500 border-pink-500 shadow-sm"
                    : "border-2 border-gray-200"
                }`}
              >
                {paymentMethod === "vnpay" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Check size={14} stroke="white" strokeWidth={4} />
                  </motion.div>
                )}
              </div>
            </div>
            <div>
              <p className={`font-bold transition-colors ${paymentMethod === "vnpay" ? "text-pink-600" : "text-gray-900"}`}>
                Thanh toán qua VNPay
              </p>
              <p className="text-sm text-gray-500 font-medium">
                Chấp nhận thẻ nội địa và QR Code ngân hàng.
              </p>
            </div>
          </motion.div>
        </label>
      </div>
    </div>
  );
}
