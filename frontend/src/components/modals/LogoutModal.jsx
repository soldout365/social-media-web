import { AlertTriangle } from "lucide-react";
import { useChatStore } from "../../store/chat.store";
import { useAuthStore } from "../../store/auth.store";
import { useDispatch } from "react-redux";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { setSelectedUser } from "@/redux/authSlice";
import { useQueryClient } from "@tanstack/react-query";

const LogoutModal = () => {
  const queryClient = useQueryClient();
  const { isLogoutModalOpen, setLogoutModalOpen } = useChatStore();
  const { logout } = useAuthStore();

  const dispatch = useDispatch();

  if (!isLogoutModalOpen) return null;

  const handleLogout = async () => {
    await logout();
    dispatch(setPosts([]));
    dispatch(setSelectedPost(null));
    dispatch(setSelectedUser(null));

    queryClient.clear();
    setLogoutModalOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 z-40"
        onClick={() => setLogoutModalOpen(false)}
      ></div>

      {/* Modal box */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal-box relative max-w-md bg-slate-900 border border-slate-400">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-red-500/10 p-3 rounded-full">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>

          {/* Content */}
          <h3 className="font-bold text-xl text-center mb-2 text-slate-400">
            Xác nhận đăng xuất
          </h3>
          <p className="text-center text-slate-400 mb-6">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?
          </p>

          {/* Action buttons */}
          <div className="flex gap-3 justify-center">
            <button
              className="btn btn-ghost min-w-[120px] text-slate-400 hover:bg-slate-700"
              onClick={() => setLogoutModalOpen(false)}
            >
              Hủy
            </button>
            <button
              className="btn min-w-[120px] bg-red-600 hover:bg-red-700 text-slate-200 border-none"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogoutModal;
