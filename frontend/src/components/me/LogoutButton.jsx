import { useState } from "react";
import { LogOut, AlertTriangle } from "lucide-react";

const LogoutButton = ({ logout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
        onClick={() => setIsOpen(true)}
      >
        <LogOut className="size-5" />
      </button>

      {/* Modal with backdrop */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal box */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-box relative max-w-md bg-slate-800 border border-slate-700">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-red-500/10 p-3 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-bold text-xl text-center mb-2 text-slate-100">
                Xác nhận đăng xuất
              </h3>
              <p className="text-center text-slate-400 mb-6">
                Bạn có chắc chắn muốn đăng xuất khỏi tài khoản của mình không?
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  className="btn btn-ghost min-w-[120px] text-slate-300 hover:text-slate-100 hover:bg-slate-700"
                  onClick={() => setIsOpen(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn min-w-[120px] bg-red-500 hover:bg-red-700 text-white border-none"
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LogoutButton;
