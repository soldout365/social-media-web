// lam luon logic suggest user trong nay
import { useAuthStore } from "@/store/auth.store";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import React, { useMemo } from "react";
import {
  useGetSuggestedUsers,
  useFollowOrUnfollowUser,
} from "@/hooks/users/useUser";

const RightSidebar = () => {
  const { authUser } = useAuthStore();
  const { data: suggestedUsers = [], isLoading } = useGetSuggestedUsers();
  const { mutate: followOrUnfollow, isPending } = useFollowOrUnfollowUser();

  // Lọc chỉ hiển thị những user chưa được follow
  const unfollowedUsers = useMemo(() => {
    if (!authUser?.following || !suggestedUsers) return suggestedUsers;

    return suggestedUsers.filter(
      (user) => !authUser.following.includes(user._id)
    );
  }, [suggestedUsers, authUser?.following]);

  const handleFollow = (userId) => {
    followOrUnfollow(userId);
  };

  return (
    <div className="w-full max-w-[300px]">
      {/* Current User Section */}
      <div className="flex items-center justify-between mb-4">
        <Link
          to={`/profile/${authUser?._id}`}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-black p-[2px]">
                <img
                  alt="Current user avatar"
                  className="w-full h-full rounded-full object-cover"
                  src={authUser?.profilePic || "/avatar.png"}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white group-hover:opacity-80 transition-opacity">
              {authUser?.fullName || "User"}
            </span>
            <span className="text-sm text-gray-400">
              {authUser?.bio || "Bio cá nhân"}
            </span>
          </div>
        </Link>
        <button className="text-xs font-semibold text-[#0095f6] hover:text-blue-600 transition-colors">
          Chuyển
        </button>
      </div>

      {/* Suggested Users Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-gray-400">Gợi ý cho bạn</p>
        <button className="text-xs font-semibold text-white hover:opacity-70 transition-opacity">
          Xem tất cả
        </button>
      </div>

      {/* Suggested Users List */}
      <div className="flex flex-col gap-2.5">
        {isLoading ? (
          <div className="text-sm text-gray-400">Đang tải...</div>
        ) : unfollowedUsers.length === 0 ? (
          <div className="text-sm text-gray-400">Không có gợi ý nào</div>
        ) : (
          unfollowedUsers.slice(0, 6).map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between mb-3"
            >
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center gap-3 cursor-pointer group flex-1"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-[2px]">
                  <div className="w-full h-full rounded-full bg-black p-[2px]">
                    <img
                      alt={`${user?.fullName} avatar`}
                      className="w-full h-full rounded-full object-cover"
                      src={user?.profilePic || "/avatar.png"}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white leading-none mb-0.5 group-hover:opacity-80 transition-opacity">
                    {user?.fullName}
                  </span>
                  <span className="text-xs text-gray-400">Gợi ý cho bạn</span>
                </div>
              </Link>
              <button
                onClick={() => handleFollow(user._id)}
                disabled={isPending}
                className="text-xs font-bold text-[#0095f6] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Đang xử lý..." : "Theo dõi"}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-8">
        <ul className="flex flex-wrap gap-x-1 gap-y-0.5 text-[11px] text-gray-500 opacity-70">
          <li className="hover:underline cursor-pointer">Giới thiệu</li>
          <li>•</li>
          <li className="hover:underline cursor-pointer">Trợ giúp</li>
          <li>•</li>
          <li className="hover:underline cursor-pointer">Báo chí</li>
          <li>•</li>
          <li className="hover:underline cursor-pointer">API</li>
          <li>•</li>
          <li className="hover:underline cursor-pointer">Việc làm</li>
          <li>•</li>
          <li className="hover:underline cursor-pointer">Quyền riêng tư</li>
          <li>•</li>
          <li className="hover:underline cursor-pointer">Điều khoản</li>
        </ul>
        <div className="mt-3 text-xs text-gray-500 opacity-70 uppercase">
          © 2025 VIBE FLOW FROM NTD
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
