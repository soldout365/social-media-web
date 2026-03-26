import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  User,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoading, error } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen w-full bg-[#FBFBFA] text-[#1A1A1A] font-sans selection:bg-[#ec5b13]/20 flex flex-col items-center justify-center py-32 px-6 overflow-hidden relative">
      {/* Background Decoration Lines */}
      <div className="fixed bottom-0 left-0 w-full h-[1px] bg-[#EAEAEA]" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 h-full w-[1px] bg-[#EAEAEA]/30" />

      {/* Header / Status Bar */}
      <div className="fixed top-0 left-0 w-full px-10 py-8 flex justify-between items-start pointer-events-none z-50">
        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="w-8 h-8 flex items-center justify-center border border-[#EAEAEA] rounded-full bg-white/50 backdrop-blur-sm">
            <LayoutGrid size={16} strokeWidth={1.5} />
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-[0.15em] text-slate-400 uppercase">
              Server: Ho Chi Minh City
            </span>
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-green-500"
            />
          </div>
        </div>
      </div>

      {/* Main Portal Container */}
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-[580px] z-10"
      >
        <div className="bg-white border border-[#EAEAEA] rounded-[2rem] p-8 md:p-12 shadow-sm">
          {/* Brand & Heading */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl md:text-6xl mb-4 text-[#1A1A1A] font-light tracking-tight italic">
              Hệ thống quản trị
            </h1>
            <p className="text-slate-500 font-light text-lg tracking-tight italic">
              Điều hành mạng xã hội và thương mại điện tử.
            </p>
          </div>

          {/* Inner Core Form Area */}
          <div className="bg-[#F9F9F8] rounded-2xl p-8 border border-[#EAEAEA]/50">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium"
              >
                {error.message}
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username field */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-[0.15em] text-slate-500 uppercase ml-1 block">
                  Email đăng nhập
                </label>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="admin@example.com"
                    className="w-full h-14 px-5 bg-white border border-[#EAEAEA] rounded-xl outline-none focus:border-[#1A1A1A] transition-colors duration-300 placeholder:text-slate-300 text-base"
                  />
                  <User
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-slate-400 transition-colors"
                    size={18}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-mono tracking-[0.15em] text-slate-500 uppercase block">
                    Mật mã
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    placeholder="••••••••"
                    className="w-full h-14 px-5 bg-white border border-[#EAEAEA] rounded-xl outline-none focus:border-[#1A1A1A] transition-colors duration-300 placeholder:text-slate-300 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Auth Button */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  whileTap={{ scale: 0.98 }}
                  className={`relative w-full h-14 ${
                    isLoading ? "bg-slate-800" : "bg-[#1A1A1A]"
                  } text-white rounded-xl overflow-hidden shadow-lg shadow-black/5 disabled:cursor-not-allowed`}
                >
                  <AnimatePresence mode="wait">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center gap-2"
                      >
                        <Loader2 size={18} className="animate-spin" />
                        <span className="font-semibold tracking-wide text-sm">
                          Đang xác thực...
                        </span>
                      </motion.div>
                    ) : !isHovered ? (
                      <motion.div
                        key="static"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <span className="font-semibold tracking-wide text-sm">
                          Xác thực truy cập
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="hover"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center gap-2"
                      >
                        <span className="font-semibold tracking-wide text-sm">
                          Tiến hành
                        </span>
                        <ArrowRight size={18} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </form>
          </div>

          {/* Meta Status Footer */}
          <div className="mt-8 flex justify-between items-center px-2">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                      alt="admin"
                      className="w-full h-full object-cover grayscale"
                    />
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center">
                  <span className="text-[8px] font-bold">+3</span>
                </div>
              </div>
              <span className="text-[10px] font-mono tracking-[0.15em] text-slate-400 uppercase">
                3 Đang trực tuyến
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.15em] text-slate-400 uppercase">
                Cấp độ bảo mật
              </span>
              <span className="px-2 py-0.5 bg-green-400 text-white text-[9px] font-mono font-bold rounded uppercase">
                Cao
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center space-y-4">
          <div className="flex justify-center gap-6">
            {["Điều khoản", "Bảo mật", "Trợ giúp"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-[10px] font-mono tracking-[0.15em] text-slate-400 hover:text-slate-900 transition-colors uppercase"
              >
                {item}
              </a>
            ))}
          </div>
          <p className="text-[10px] font-mono tracking-[0.15em] text-slate-300 uppercase flex items-center justify-center gap-1">
            <ShieldCheck size={10} /> © 2026 Vibe Flow - Bảo mật cấp độ cao
          </p>
        </footer>
      </motion.main>
    </div>
  );
};

export default LoginPage;
