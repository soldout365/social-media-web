import { VideoIcon, XIcon } from "lucide-react";
import { useChatStore } from "../../store/chat.store";
import { useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useStreamVideo } from "@/hooks/streams/useStreamVideo";
import { useVideoCallStore } from "@/store/videoCall.store";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, authUser, socket } = useAuthStore();

  const isUserOnline = onlineUsers.includes(selectedUser._id);

  const { client } = useStreamVideo();

  const { startWaiting, clearWaiting, setTimeoutId, startCall } =
    useVideoCallStore();

  const navigate = useNavigate();

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    globalThis.addEventListener("keydown", handleEscKey);
    // cleanup function
    return () => globalThis.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  // ============================================
  // XỬ LÝ KHI BẮT ĐẦU GỌI VIDEO (CALLER)
  // ============================================
  const handleVideoCall = () => {
    // Kiểm tra điều kiện để gọi
    if (!socket || !client || !selectedUser) {
      toast.error("Không thể bắt đầu cuộc gọi");
      return;
    }
    if (!isUserOnline) {
      toast.error("Người dùng đang offline, không thể gọi");
      return;
    }

    // Tạo callId tạm (chưa tạo Stream call)
    const callId = `${authUser._id}-${selectedUser._id}-${Date.now()}`;

    // Gửi invitation qua socket
    socket.emit("video_call_request", {
      to: selectedUser._id,
      from: authUser._id,
      callId,
      callerInfo: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
    });

    // Lưu vào store và hiển thị WaitingModal
    startWaiting({
      callId,
      peer: selectedUser,
      timestamp: Date.now(),
    });

    // Hủy cuộc gọi (khi đang đợi)
    const handleCancelCall = () => {
      const { pendingCall } = useVideoCallStore.getState();
      if (!pendingCall || !socket) return;

      // Gửi signal cancel đến callee
      socket.emit("video_call_cancelled", {
        callId: pendingCall.callId,
        to: pendingCall.peer._id,
      });
      clearWaiting();
    };

    // Timeout 60 giây (để có thời gian cho network delay)
    const timeout = setTimeout(() => {
      handleCancelCall();
      toast.error("Không có phản hồi từ người nhận");
    }, 60000);

    setTimeoutId(timeout);
  };

  // ============================================
  // SOCKET LISTENERS CHO VIDEO CALL
  // ============================================
  useEffect(() => {
    if (!socket) return;

    // Listener: Callee đã chấp nhận → Tạo Stream call và navigate
    const handlePeerAccepted = async ({ callId }) => {
      try {
        // Bây giờ mới tạo Stream call (khi chắc chắn sẽ dùng)
        const call = client.call("default", callId);
        await call.getOrCreate({
          ring: false,
          data: {
            members: [{ user_id: authUser._id }, { user_id: selectedUser._id }],
          },
        });

        // Notify callee rằng call đã sẵn sàng
        socket.emit("video_call_ready", {
          callId,
          to: selectedUser._id,
        });

        // Clear waiting state và navigate
        startCall(callId);
        navigate(`/streams/${callId}`);
      } catch (error) {
        console.error("Error creating Stream call:", error);
        toast.error("Lỗi khi tạo cuộc gọi");
        clearWaiting();
      }
    };

    // Listener: Callee đã từ chối
    const handlePeerRejected = () => {
      clearWaiting();
      toast.error(`${selectedUser.fullName} đã từ chối cuộc gọi`);
    };

    // Listener: Không thể gọi (user offline)
    const handleCallFailed = ({ reason }) => {
      clearWaiting();
      toast.error(
        reason === "User is offline"
          ? "Người dùng đang offline"
          : "Không thể gọi"
      );
    };

    // Đăng ký listeners
    socket.on("video_call_peer_accepted", handlePeerAccepted);
    socket.on("video_call_peer_rejected", handlePeerRejected);
    socket.on("video_call_failed", handleCallFailed);

    // Cleanup
    return () => {
      socket.off("video_call_peer_accepted", handlePeerAccepted);
      socket.off("video_call_peer_rejected", handlePeerRejected);
      socket.off("video_call_failed", handleCallFailed);
    };
  }, [
    socket,
    client,
    authUser,
    selectedUser,
    navigate,
    startCall,
    clearWaiting,
  ]);

  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm border-b border-slate-700/50 max-h-[84px] px-10 py-4 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="avatar">
            <div className="w-12 h-12 rounded-full ring-2 ring-slate-600/50 ring-offset-2 ring-offset-slate-800 mt-1.5">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-slate-100 font-semibold text-lg tracking-tight">
            {selectedUser.fullName}
          </h3>
          <p
            className={`text-sm font-medium flex items-center gap-1.5 ${
              isUserOnline ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isUserOnline ? "bg-emerald-400 animate-pulse" : "bg-slate-500"
              }`}
            ></span>
            {isUserOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* NÚT CALL VIDEO */}
        <button
          onClick={handleVideoCall}
          disabled={!isUserOnline}
          className={`p-2 rounded-lg cursor-pointer transition-all duration-200 group  ${
            isUserOnline
              ? "hover:bg-emerald-500/20 hover:ring-2 hover:ring-emerald-500/50 "
              : "opacity-50 "
          }`}
          aria-label="Start video call"
          title={isUserOnline ? "Gọi video" : "Người dùng đang offline"}
        >
          <VideoIcon
            className={`w-6 h-5 transition-all duration-200 ${
              isUserOnline
                ? "text-emerald-400 group-hover:text-emerald-300 group-hover:scale-110"
                : "text-slate-600"
            }`}
          />
        </button>

        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
          aria-label="Close chat"
        >
          <XIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-100 group-hover:rotate-90 transition-all duration-200" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
