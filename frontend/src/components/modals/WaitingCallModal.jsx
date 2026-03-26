import { Phone, X } from "lucide-react";
import { useVideoCallStore } from "@/store/videoCall.store";

const WaitingCallModal = ({ onCancel }) => {
  const { pendingCall } = useVideoCallStore();

  if (!pendingCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-700/50">
        {}

        <div className="flex flex-col items-center space-y-6">
          {}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>
            <div className="relative w-24 h-24 rounded-full ring-4 ring-emerald-500/50 ring-offset-4 ring-offset-slate-900">
              <img
                src={pendingCall.peer.profilePic || "/avatar.png"}
                alt={pendingCall.peer.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          {}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold text-slate-100">
              {pendingCall.peer.fullName}
            </h3>
            <p className="text-slate-400 flex items-center justify-center gap-2">
              <Phone className="w-4 h-4 animate-bounce" />
              Đang gọi...
            </p>
          </div>

          {}
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
          </div>

          {}
          <p className="text-sm text-slate-500 text-center max-w-xs">
            Đang chờ {pendingCall.peer.fullName} chấp nhận cuộc gọi...
          </p>

          {}
          <button
            onClick={onCancel}
            className="w-full mt-4 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-all duration-200 font-medium border border-red-500/20 hover:border-red-500/40"
          >
            Hủy cuộc gọi
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitingCallModal;
