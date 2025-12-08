import { LogOut } from "lucide-react";
import { useChatStore } from "../../store/chat.store";

const LogoutButton = ({ showText = false }) => {
  const { setLogoutModalOpen } = useChatStore();

  return (
    <button
      className={`${
        showText
          ? "flex items-center gap-3 w-full hover:bg-gray-100 rounded-lg p-3 text-black"
          : "text-slate-400 hover:text-slate-200"
      } transition-colors duration-200`}
      onClick={() => setLogoutModalOpen(true)}
    >
      <LogOut className={showText ? "size-6" : "size-5"} />
      {showText && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;
