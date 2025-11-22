import { XIcon } from "lucide-react";
import { useChatStore } from "../../store/chat.store";
import { useEffect } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);

  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-slate-800/60 to-slate-900/60 backdrop-blur-sm border-b border-slate-700/50 max-h-[84px] px-10 py-4 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="avatar online">
            <div className="w-12 h-12 rounded-full ring-2 ring-slate-600/50 ring-offset-2 ring-offset-slate-800">
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
          <p className="text-emerald-400 text-sm font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            Online
          </p>
        </div>
      </div>

      <button
        onClick={() => setSelectedUser(null)}
        className="p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
        aria-label="Close chat"
      >
        <XIcon className="w-5 h-5 text-slate-400 group-hover:text-slate-100 group-hover:rotate-90 transition-all duration-200" />
      </button>
    </div>
  );
};

export default ChatHeader;
