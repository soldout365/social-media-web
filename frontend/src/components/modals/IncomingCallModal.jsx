import { Phone, PhoneOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Component hiển thị popup khi có cuộc gọi đến
const IncomingCallModal = ({ caller, callId, onAccept, onReject }) => {
  const [countdown, setCountdown] = useState(60); //60s

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      onReject();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup
  }, [countdown, onReject]);

  // Function accept call
  const handleAccept = async () => {
    await onAccept();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-slate-700/50 relative overflow-hidden">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 animate-pulse" />
        {/* CALLER INFO */}
        <div className="relative text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full ring-4 ring-green-400/50 shadow-lg bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
            <Phone className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-white text-xl font-bold mb-2">
            {caller?.name || "Người dùng"}
          </h3>
          <p className="text-slate-300 text-sm font-medium mb-4">
            Đang gọi video cho bạn...
          </p>
          <div className="inline-block px-4 py-2 bg-slate-800/70 rounded-full border border-slate-600/50">
            <p className="text-slate-300 text-sm font-medium">
              ⏱ Tự động từ chối sau {countdown}s
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="relative flex gap-4 justify-center">
          <button
            onClick={onReject}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-red-500/50 hover:scale-105 font-semibold active:scale-95"
          >
            <PhoneOff className="w-5 h-5" />
            Từ chối
          </button>

          <button
            onClick={handleAccept}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-green-500/50 hover:scale-105 font-semibold active:scale-95"
          >
            <Phone className="w-5 h-5" />
            Chấp nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
