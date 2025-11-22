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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Modal box */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal-box relative max-w-md">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-warning/10 p-3 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-warning" />
                </div>
              </div>

              {/* Content */}
              <h3 className="font-bold text-xl text-center mb-2">
                Confirm Logout
              </h3>
              <p className="text-center text-slate-500 mb-6">
                Are you sure you want to log out of your account?
              </p>

              {/* Action buttons */}
              <div className="flex gap-3 justify-center">
                <button
                  className="btn btn-ghost min-w-[120px]"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn min-w-[120px] bg-red-500 "
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                >
                  Log Out
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
