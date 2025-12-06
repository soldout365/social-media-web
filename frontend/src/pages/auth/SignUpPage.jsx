import { useState } from "react";
import {
  MessageCircleIcon,
  LockIcon,
  MailIcon,
  UserIcon,
  LoaderIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store.js";
import BorderAnimatedContainer from "@/components/BorderAnimatedContainer";

function SignUpPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  return (
    <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
      <BorderAnimatedContainer>
        <div className="w-full flex flex-col md:flex-row">
          {/* FORM CLOUMN - LEFT SIDE */}
          <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
            <div className="w-full max-w-md">
              {/* HEADING TEXT */}
              <div className="text-center mb-8">
                <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                <h2 className="text-2xl font-bold text-slate-200 mb-2">
                  Start your journey
                </h2>
                <p className="text-slate-400">Đăng kí tài khoản mới</p>
              </div>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* FULL NAME */}
                <div>
                  <label className="auth-input-label">Nhập Tên</label>
                  <div className="relative">
                    <UserIcon className="auth-input-icon" />

                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="input"
                      placeholder="Tên của bạn"
                    />
                  </div>
                </div>

                {/* EMAIL INPUT */}
                <div>
                  <label className="auth-input-label">Email</label>
                  <div className="relative">
                    <MailIcon className="auth-input-icon" />

                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="input"
                      placeholder="abcxyz@gmail.com"
                    />
                  </div>
                </div>

                {/* PASSWORD INPUT */}
                <div>
                  <label className="auth-input-label">Password</label>
                  <div className="relative">
                    <LockIcon className="auth-input-icon" />

                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className="input"
                      placeholder="*********"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  className="auth-btn"
                  type="submit"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <LoaderIcon className="w-full h-5 animate-spin text-center" />
                  ) : (
                    "Tạo tài khoản"
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="auth-link">
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
            </div>
          </div>

          {/* FORM ILLUSTRATION - RIGHT SIDE */}
          <div className="hidden md:w-1/2 md:flex items-center justify-center p-20 bg-gradient-to-bl from-slate-800/20 to-transparent">
            <div>
              <img
                src="/3.png"
                alt="signup illustration"
                className="w-full h-auto object-contain"
              />
              <div className="mt-6 text-center">
                <h3 className="text-xl font-medium text-cyan-400">
                  Start Your Journey Today
                </h3>
              </div>
            </div>
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default SignUpPage;
