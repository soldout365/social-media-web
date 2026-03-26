import { useState } from "react";

function PageLoader() {
  return (
    // Container toàn màn hình với nền gradient xanh nước biển
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-cyan-300 via-teal-500 to-blue-900">
      <LiquidWaveLoader />
    </div>
  );
}
function LiquidWaveLoader() {
  return (
    <div className="flex flex-col items-center gap-8">
      {/* Container chứa hiệu ứng nước */}
      <div className="relative w-40 h-40">
        {/* Cốc/ly chứa nước - viền tròn trắng */}
        <div className="absolute inset-0 rounded-full border-4 border-white/30 overflow-hidden bg-white/5 backdrop-blur-sm shadow-2xl">
          {/* Lớp nước bên trong - dùng clip-path tạo sóng */}
          <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-t from-cyan-400 via-teal-400 to-blue-400 opacity-80">
            {/* Sóng 1 - sóng lớn chạy chậm */}
            <div
              className="absolute inset-0 wave-animation"
              style={{ animationDelay: "0s" }}
            >
              <svg viewBox="0 0 1200 120" className="absolute bottom-0 w-full">
                <path
                  d="M0,60 Q150,90 300,60 T600,60 T900,60 T1200,60 L1200,120 L0,120 Z"
                  fill="rgba(255,255,255,0.3)"
                />
              </svg>
            </div>

            {/* Sóng 2 - sóng nhỏ hơn chạy nhanh hơn */}
            <div
              className="absolute inset-0 wave-animation-fast"
              style={{ animationDelay: "-10s" }}
            >
              <svg viewBox="0 0 1200 120" className="absolute bottom-0 w-full">
                <path
                  d="M0,70 Q150,50 300,70 T600,70 T900,70 T1200,70 L1200,120 L0,120 Z"
                  fill="rgba(255,255,255,0.2)"
                />
              </svg>
            </div>
          </div>

          {/* Giọt nước rơi từ trên xuống */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full animate-drip shadow-lg shadow-white/50"></div>
          <div className="absolute top-0 left-1/3 -translate-x-1/2 w-2 h-2 bg-cyan-200 rounded-full animate-drip animation-delay-1 shadow-md"></div>
          <div className="absolute top-0 left-2/3 -translate-x-1/2 w-2 h-2 bg-teal-200 rounded-full animate-drip animation-delay-2 shadow-md"></div>
          <div className="absolute top-0 left-2/5 -translate-x-1/2 w-2 h-2 bg-teal-300 rounded-full animate-drip animation-delay-3 shadow-md"></div>
        </div>

        {/* Bong bóng nổi lên từ dưới */}
        <div className="absolute bottom-8 left-1/4 w-2 h-2 bg-white/60 rounded-full animate-bubble"></div>
        <div className="absolute bottom-12 left-1/2 w-3 h-3 bg-white/40 rounded-full animate-bubble animation-delay-1"></div>
        <div className="absolute bottom-10 right-1/4 w-2 h-2 bg-white/50 rounded-full animate-bubble animation-delay-2"></div>
        <div className="absolute bottom-14 right-1/3 w-2 h-2 bg-white/30 rounded-full animate-bubble animation-delay-3"></div>
      </div>

      {/* Text loading */}
      <div className="flex flex-col items-center gap-4">
        <p className="text-white font-bold text-2xl tracking-wider animate-pulse drop-shadow-lg">
          Đang tải dữ liệu...
        </p>
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce shadow-lg"></div>
          <div className="w-2.5 h-2.5 bg-cyan-100 rounded-full animate-bounce [animation-delay:-0.05s] shadow-lg"></div>
          <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.1s] shadow-lg"></div>
        </div>
      </div>

      {/* CSS cho animations */}
      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(-25%) translateY(-10px);
          }
        }
        @keyframes wave-fast {
          0%,
          100% {
            transform: translateX(0) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(-15px);
          }
        }
        @keyframes drip {
          0% {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            transform: translateX(-50%) translateY(160px);
            opacity: 0;
          }
        }
        @keyframes bubble {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-140px) scale(0.3);
            opacity: 0;
          }
        }
        .wave-animation {
          animation: wave 3s ease-in-out infinite;
        }
        .wave-animation-fast {
          animation: wave-fast 2s ease-in-out infinite;
        }
        .animate-drip {
          animation: drip 2s ease-in infinite;
        }
        .animate-bubble {
          animation: bubble 4s ease-in-out infinite;
        }
        .animation-delay-1 {
          animation-delay: 0.7s;
        }
        .animation-delay-2 {
          animation-delay: 1.4s;
        }
      `}</style>
    </div>
  );
}

// ========== ORBITAL PLANETS LOADER ==========

export default PageLoader;
