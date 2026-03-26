import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Calendar,
  LogOut,
  Edit3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserData {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  createdAt?: string;
  avatar?: string;
  profilePic?: string;
}

export const ProfilePage = () => {
  const navigate = useNavigate();

  const user: UserData = React.useMemo(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const displayName = user?.fullName || "Admin";
  const displayRole = user?.role === "admin" ? "Quản trị viên" : "Người dùng";

  const infoFields = [
    {
      icon: Mail,
      label: "Email",
      value: user?.email || "Chưa cập nhật",
    },
    {
      icon: Phone,
      label: "Số điện thoại",
      value: user?.phone || "Chưa cập nhật",
    },
    {
      icon: MapPin,
      label: "Địa chỉ",
      value: user?.address || "Chưa cập nhật",
    },
    {
      icon: Shield,
      label: "Vai trò",
      value: displayRole,
    },
    {
      icon: Calendar,
      label: "Ngày tham gia",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#FAFAFA] p-8 pt-24"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-[#111111]">Hồ sơ cá nhân</h1>
          <p className="text-[#787774] mt-2">
            Quản lý thông tin tài khoản của bạn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#EAEAEA]">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full border-4 border-[#F7F6F3] overflow-hidden mb-4">
                  <img
                    src={
                      user?.profilePic ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`
                    }
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-[#111111]">
                  {displayName}
                </h2>
                <p className="text-[#787774] text-sm mt-1">{displayRole}</p>

                <button className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-[#333333] transition-colors">
                  <Edit3 size={16} />
                  Chỉnh sửa hồ sơ
                </button>

                <button
                  onClick={handleLogout}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-[#EAEAEA] text-[#DC2626] rounded-lg text-sm font-medium hover:bg-[#FEF2F2] transition-colors"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#EAEAEA]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#F7F6F3] flex items-center justify-center">
                  <User size={20} className="text-[#111111]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111111]">
                  Thông tin cá nhân
                </h3>
              </div>

              <div className="space-y-4">
                {infoFields.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 py-3 border-b border-[#EAEAEA] last:border-0"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#F7F6F3] flex items-center justify-center flex-shrink-0">
                      <field.icon size={18} className="text-[#787774]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#787774]">{field.label}</p>
                      <p className="text-sm font-medium text-[#111111] truncate">
                        {field.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-[#EAEAEA]">
              <h3 className="text-lg font-semibold text-[#111111] mb-4">
                Thống kê tài khoản
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#F7F6F3] rounded-xl">
                  <p className="text-xs text-[#787774] mb-1">Trạng thái</p>
                  <p className="text-lg font-semibold text-[#111111]">
                    Hoạt động
                  </p>
                </div>
                <div className="p-4 bg-[#F7F6F3] rounded-xl">
                  <p className="text-xs text-[#787774] mb-1">Xác thực</p>
                  <p className="text-lg font-semibold text-[#111111]">
                    {user?.email ? "Đã xác thực" : "Chưa xác thực"}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
