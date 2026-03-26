import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crosshair, MagnifyingGlass } from "@phosphor-icons/react";
import { FONTS } from "../pages/home/dashboard/components/theme";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { userApi } from "../apis/user.api";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Force re-render on navigation by using location.key
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  React.useEffect(() => {
    forceUpdate();
  }, [location.key]);

  // Read user directly from localStorage
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const displayName = user?.fullName || "Admin";

  const handleLogout = async () => {
    try {
      await userApi.logout();
    } catch {
      // Continue with local logout even if API call fails
      console.warn("Logout API failed, continuing with local logout");
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setIsDropdownOpen(false);
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [isDropdownOpen]);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl pointer-events-none">
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="bg-[rgba(255,255,255,0.7)] backdrop-blur-xl border border-[rgba(255,255,255,0.4)] shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-full px-6 py-4 flex items-center justify-between pointer-events-auto"
      >
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-[#111111] text-[#FFFFFF] p-1.5 rounded-full flex items-center justify-center">
            <Crosshair size={16} weight="bold" />
          </span>
          <span
            className="text-sm font-semibold tracking-tight text-[#111111]"
            style={{ fontFamily: FONTS.sans }}
          >
            Vibe Flow
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className={`text-[13px] font-medium transition-colors ${
              location.pathname === "/"
                ? "text-[#111111]"
                : "text-[#787774] hover:text-[#111111]"
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/product"
            className={`text-[13px] font-medium transition-colors ${
              location.pathname.startsWith("/product")
                ? "text-[#111111]"
                : "text-[#787774] hover:text-[#111111]"
            }`}
          >
            Sản phẩm
          </Link>
          <Link
            to="/order"
            className={`text-[13px] font-medium transition-colors ${
              location.pathname.startsWith("/order")
                ? "text-[#111111]"
                : "text-[#787774] hover:text-[#111111]"
            }`}
          >
            Đơn hàng
          </Link>
          <Link
            to="/brand"
            className={`text-[13px] font-medium transition-colors ${
              location.pathname.startsWith("/brand")
                ? "text-[#111111]"
                : "text-[#787774] hover:text-[#111111]"
            }`}
          >
            Thương hiệu
          </Link>
          <Link
            to="/category"
            className={`text-[13px] font-medium transition-colors ${
              location.pathname.startsWith("/category")
                ? "text-[#111111]"
                : "text-[#787774] hover:text-[#111111]"
            }`}
          >
            Danh mục
          </Link>
          <Link
            to="/voucher"
            className={`text-[13px] font-medium transition-colors ${
              location.pathname.startsWith("/voucher")
                ? "text-[#111111]"
                : "text-[#787774] hover:text-[#111111]"
            }`}
          >
            Khuyến mãi
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <MagnifyingGlass
            size={18}
            className="text-[#787774] hover:text-[#111111] cursor-pointer transition-colors"
          />
          <div className="w-[1px] h-4 bg-[#EAEAEA]" />
          <div className="relative">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={toggleDropdown}
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-medium text-[#111111]">
                  {displayName || "Admin"}
                </span>
                <span className="mt-1 text-[10px] text-[#787774] ">
                  Quản trị viên
                </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-[#EAEAEA] bg-[#F7F6F3] overflow-hidden group-hover:grayscale-0 transition-all">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#EAEAEA] overflow-hidden"
                >
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#111111] hover:bg-[#F7F6F3] transition-colors"
                  >
                    <User size={16} />
                    Thông tin cá nhân
                  </button>
                  <div className="w-full h-[1px] bg-[#EAEAEA]" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </nav>
  );
};
