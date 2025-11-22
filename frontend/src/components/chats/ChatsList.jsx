import { useEffect } from "react";
import UsersLoadingSkeleton from "../loads/UsersLoadingSkeleton.jsx";
import NoChatsFound from "./NoChatsFound.jsx";
import { useChatStore } from "../../store/chat.store.js";

const ChatsList = () => {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } =
    useChatStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <div className="space-y-3 p-2">
      {chats.map((chat) => (
        <div
          className="group relative bg-gradient-to-br from-slate-800/50 via-slate-800/30 to-transparent backdrop-blur-sm p-2.5 rounded-2xl cursor-pointer hover:from-cyan-500/20 hover:via-slate-800/40 hover:to-blue-500/10 transition-all duration-500 border border-slate-700/50 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-500/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          key={chat._id}
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-4">
            {/**logic online offline dua tren socketio */}
            <div className="relative flex-shrink-0">
              <div className="size-16 rounded-full overflow-hidden ring-2 ring-cyan-500/30 group-hover:ring-4 group-hover:ring-cyan-400/60 transition-all duration-500 shadow-lg group-hover:shadow-cyan-500/50">
                <img
                  src={chat.profilePic || "/avatar.png"}
                  alt={chat.fullName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute bottom-0 right-0 size-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full ring-2 ring-slate-900 shadow-lg shadow-cyan-500/50"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-lg text-slate-100 font-bold truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-300 group-hover:to-blue-400 transition-all duration-300">
                {chat.fullName}
              </h4>
              <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                Nhấn để trò chuyện
              </p>
            </div>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-6 h-6 text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatsList;
