import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-container-dark/50 border-t border-border-dark mt-24 py-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 text-center md:text-left">
        <div className="md:col-span-2">
          <h4 className="font-black text-2xl tracking-tighter mb-4 bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent inline-block">
            Vibe Flow
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed pr-0 md:pr-20">
            Đơn vị phân phối thời trang thời thượng chính hãng hàng đầu tại Việt
            Nam. Mang lại trải nghiệm thời trang đỉnh cao và sự đẳng cấp khác
            biệt.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-5 uppercase text-xs tracking-[0.2em]">
            Liên hệ
          </h4>
          <p className="text-slate-400 text-sm mb-3 hover:text-pink-400 transition-colors cursor-pointer">
            Hotline: 0866 052 273
          </p>
          <p className="text-slate-400 text-sm hover:text-pink-400 transition-colors cursor-pointer">
            Email: dung.dev@gmail.com
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-5 uppercase text-xs tracking-[0.2em]">
            Địa chỉ
          </h4>
          <p className="text-slate-400 text-sm leading-relaxed">
            Tòa nhà Vibe Flow, Quận 7, <br /> TP. Hồ Chí Minh, Việt Nam
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-border-dark flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-slate-500 text-xs font-medium">
          © 2026 Vibe Flow Store. All rights reserved.
        </p>
        <div className="flex gap-8">
          <a
            className="text-slate-500 hover:text-pink-400 transition-colors text-xs font-medium"
            href="#"
          >
            Chính sách bảo mật
          </a>
          <a
            className="text-slate-500 hover:text-pink-400 transition-colors text-xs font-medium"
            href="#"
          >
            Điều khoản dịch vụ
          </a>
        </div>
      </div>
    </footer>
  );
}
