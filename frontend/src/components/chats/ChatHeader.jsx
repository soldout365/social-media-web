import { Video, VideoIcon, XIcon } from "lucide-react";
import { useChatStore } from "../../store/chat.store";
import { useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useStreamVideo } from "@/hooks/streams/useStreamVideo";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const isUserOnline = onlineUsers.includes(selectedUser._id);

  const { client, isLoading } = useStreamVideo();

  const navigate = useNavigate();

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };
    window.addEventListener("keydown", handleEscKey);
    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  // XỬ LÝ KHI BẮT ĐẦU GỌI VIDEO (CALLER)
  const handleVideoCall = async () => {
    // Kiểm tra điều kiện trước khi gọi
    if (!client || !selectedUser) {
      toast.error("Không thể bắt đầu cuộc gọi");
      return;
    }
    if (!isUserOnline) {
      toast.error("Người dùng đang offline, không thể gọi");
      return;
    }

    try {
      // Tạo callId duy nhất: userId1-userId2-timestamp
      const callId = `${authUser._id}-${selectedUser._id}-${Date.now()}`;

      // Tạo call instance từ client
      const call = client.call("default", callId);

      // getOrCreate: tạo cuộc gọi và gửi ring notification đến members
      await call.getOrCreate({
        ring: true, // Bật ringing để callee nhận modal
        data: {
          members: [{ user_id: authUser._id }, { user_id: selectedUser._id }],
        },
      });

      // Navigate đến CallPage - join sẽ xảy ra ở đó
      navigate(`/streams/${callId}`);
    } catch (error) {
      console.error("Lỗi khi bắt đầu cuộc gọi video:", error);
      toast.error("Lỗi khi bắt đầu cuộc gọi video");
    }
  };

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
