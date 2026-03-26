import React from "react";

export default function ShippingInfoForm({ shippingInfo, handleInputChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Thông tin giao hàng
      </h2>
      <div className="space-y-4">
        {}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">
            Họ và tên
          </label>
          <input
            name="name"
            value={shippingInfo.name}
            onChange={handleInputChange}
            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
            placeholder="Nhập họ tên..."
            type="text"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">
              Số điện thoại
            </label>
            <input
              name="phone"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
              placeholder="0xxx..."
              type="tel"
            />
          </div>
          {}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">
              Email
            </label>
            <input
              name="email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
              placeholder="example@gmail.com"
              type="email"
            />
          </div>
        </div>
        {}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">
            Địa chỉ
          </label>
          <input
            name="address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-black focus:border-black transition-all outline-none"
            placeholder="Số nhà, tên đường..."
            type="text"
          />
        </div>
        {}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 ml-1">
            Ghi chú đơn hàng
          </label>
          <textarea
            name="note"
            value={shippingInfo.note}
            onChange={handleInputChange}
            className="w-full bg-white border border-gray-100 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-black focus:border-black transition-all outline-none resize-none"
            placeholder="Lời nhắn cho shipper..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
