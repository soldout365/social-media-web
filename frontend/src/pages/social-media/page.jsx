import React from "react";
// import { useNavigate } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import Posts from "./post/Posts";

export default function SocialMediaPage() {
  // const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-black text-white">
      {/* SIDEBAR BÊN TRÁI */}
      <LeftSidebar />
      {/* NỘI DUNG CHÍNH (Feed) */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl mx-auto py-8">
          {/* Stories - Thanh trượt ngang */}
          <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
            <Story username="sim_bs0707" />
            <Story username="chotutufan" />
            <Story username="pharacoolboy" />
            <Story username="naxisneaker" />
            <Story username="t1lol" />
          </div>
          {/* Posts */}
          <Posts />
        </div>
      </div>

      {/** */}
      {/* SIDEBAR BÊN PHẢI */}
      <div className="w-80 p-8">
        {/* Thông tin user hiện tại */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600" />
          <div className="flex-1">
            <div className="font-semibold">zzbrave_</div>
            <div className="text-sm text-gray-400">Dungx</div>
          </div>
          <button className="text-blue-400 text-sm font-semibold">
            Chuyển
          </button>
        </div>

        {/* Gợi ý cho bạn */}
        <div className="mb-4">
          <div className="flex justify-between mb-4">
            <div className="text-gray-400 font-semibold">Gợi ý cho bạn</div>
            <button className="text-sm">Xem tất cả</button>
          </div>

          <SuggestedUser
            username="_ghetdihocvl_"
            subtitle="Có uongtr.ki theo dõi"
          />
          <SuggestedUser
            username="just.benl"
            subtitle="Có august.vannghia theo dõi"
          />
          <SuggestedUser
            username="_np.wwnu_"
            subtitle="Có uongtr.ki theo dõi"
          />
          <SuggestedUser
            username="fluently.mey"
            subtitle="Có _dngcv__ theo dõi"
          />
          <SuggestedUser
            username="august_us28"
            subtitle="Có _dngcv__ theo dõi"
          />
        </div>

        {/* Footer links */}
        {/* <div className="text-xs text-gray-500 mt-8 space-y-2">
          <div className="flex flex-wrap gap-2">
            <a href="#">Giới thiệu</a> · <a href="#">Trợ giúp</a> ·{" "}
            <a href="#">API</a>
          </div>
          <div>© 2025 Instagram from Meta</div>
        </div> */}
      </div>
    </div>
  );
}

// Component Story - Hiển thị avatar story
function Story({ username }) {
  return (
    <div className="flex flex-col items-center gap-1 cursor-pointer">
      {/* Vòng tròn gradient bao quanh avatar */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-600 p-0.5">
        <div className="w-full h-full rounded-full bg-black p-0.5">
          <div className="w-full h-full rounded-full bg-gray-700" />
        </div>
      </div>
      <span className="text-xs">{username}</span>
    </div>
  );
}

// Component Post - Bài viết chính

// Component SuggestedUser - Gợi ý người dùng
function SuggestedUser({ username, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-full bg-gray-700" /> {/* Avatar */}
      <div className="flex-1">
        <div className="font-semibold text-sm">{username}</div>
        <div className="text-xs text-gray-400">{subtitle}</div>
      </div>
      <button className="text-blue-400 text-sm font-semibold">Theo dõi</button>
    </div>
  );
}
