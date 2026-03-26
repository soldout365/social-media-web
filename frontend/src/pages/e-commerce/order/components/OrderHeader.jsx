import React from "react";
import { ShoppingBag, Star } from "lucide-react";

const OrderHeader = () => {
  return (
    <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center md:justify-start gap-4 text-zinc-900">
          <span className="bg-gradient-to-br from-yellow-400 to-pink-600 p-2.5 rounded-2xl text-white shadow-xl shadow-pink-500/20">
            <ShoppingBag size={28} />
          </span>
          Lịch sử đơn hàng
        </h1>
        <p className="text-zinc-500 mt-3 text-sm font-medium tracking-wide">
          Theo dõi và quản lý hành trình mua sắm của bạn một cách dễ dàng
        </p>
      </div>
      <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-zinc-100 shadow-sm self-center md:self-auto">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 overflow-hidden shadow-sm"
            >
              <img
                src={`https:
                alt="user"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest pr-3 border-r border-zinc-100">
          Cộng đồng tin dùng
        </span>
        <div className="flex items-center gap-1 text-yellow-400 ml-1">
          <Star size={12} fill="currentColor" />
          <span className="text-xs font-bold text-zinc-900 tracking-tight">
            4.9/5
          </span>
        </div>
      </div>
    </header>
  );
};

export default OrderHeader;
