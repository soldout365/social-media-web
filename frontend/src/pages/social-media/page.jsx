import React from "react";
import { Menu, Send, Bookmark, MessageCircle } from "lucide-react";
import Home from "@/assets/home.svg?react";
import Search from "@/assets/search.svg?react";
import Heart from "@/assets/heart.svg?react";
import Create from "@/assets/create.svg?react";
import Explore from "@/assets/explore.svg?react";
import Reels from "@/assets/reels.svg?react";
import Messenger from "@/assets/messenger.svg?react";
import Profile from "@/assets/profile.svg?react";
import { MenuItem } from "./components/MenuItem";

export default function SocialMediaPage() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* SIDEBAR BÊN TRÁI */}
      <div className="w-64 border-r border-gray-800 p-4 flex flex-col">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-full h-auto object-contain object-center mb-5 mt-6"
          style={{ aspectRatio: "auto" }}
        />
        {/* Menu phía trên */}
        <nav className="flex-1 space-y-2">
          <MenuItem
            icon={<Home width={24} height={24} />}
            text="Trang chủ"
            active
          />
          <MenuItem icon={<Search width={24} height={24} />} text="Tìm kiếm" />
          <MenuItem icon={<Explore width={24} height={24} />} text="Khám phá" />
          <MenuItem icon={<Reels width={24} height={24} />} text="Reels" />
          <MenuItem
            icon={<Messenger width={24} height={24} />}
            text="Tin nhắn"
          />
          <MenuItem icon={<Heart width={24} height={24} />} text="Thông báo" />
          <MenuItem icon={<Create width={24} height={24} />} text="Tạo" />
          <MenuItem
            icon={<Profile width={24} height={24} />}
            text="Trang cá nhân"
          />
        </nav>
        {/* Menu phía dưới */}
        <div className="mt-auto">
          <MenuItem icon={<Menu size={24} />} text="Xem thêm" />
        </div>
      </div>
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

          {/* Bài viết 1 */}
          <Post username="webguild" timeAgo="9 giờ" likes="191" comments="2" />

          {/* Bài viết 2 */}
          <Post
            username="couple4infiny"
            timeAgo="5 tuần"
            likes="1,4 triệu"
            comments="3,8K"
            suggested
          />

          {/* Bài viết 3 */}
          <Post
            username="chithe.maycongabietgi"
            timeAgo="1 ngày"
            likes="3,3K"
            comments="88"
            suggested
          />
        </div>
      </div>
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

// Component MenuItem - Item trong menu sidebar
// function MenuItem({ icon, text, active, badge }) {
//   return (
//     <div
//       className={`flex items-center gap-4 px-3 py-3 rounded-lg cursor-pointer hover:bg-gray-900 transition ${
//         active ? "font-bold" : ""
//       }`}
//     >
//       <div className="relative">
//         {icon}
//         {badge && ( // Hiển thị badge nếu có (ví dụ: số tin nhắn chưa đọc)
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//             {badge}
//           </span>
//         )}
//       </div>
//       <span className={active ? "font-semibold" : ""}>{text}</span>
//     </div>
//   );
// }

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
function Post({ username, timeAgo, likes, comments, suggested }) {
  return (
    <div className="mb-8 border-b border-gray-800 pb-4">
      {/* Header bài viết */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-700" /> {/* Avatar */}
          <div>
            <span className="font-semibold">{username}</span>
            {suggested && (
              <span className="text-gray-400 text-sm"> • Gợi ý cho bạn</span>
            )}
          </div>
          <span className="text-gray-400 text-sm">• {timeAgo}</span>
        </div>
        <button>⋯</button>
      </div>

      {/* Hình ảnh/Video bài viết */}
      <div className="bg-gray-900 aspect-square mb-3 flex items-center justify-center text-gray-500">
        [Video/Hình ảnh]
      </div>

      {/* Action buttons (Like, Comment, Share, Save) */}
      <div className="flex items-center gap-4 mb-2">
        <Heart size={24} className="cursor-pointer hover:text-gray-400" />
        <MessageCircle
          size={24}
          className="cursor-pointer hover:text-gray-400"
        />
        <Send size={24} className="cursor-pointer hover:text-gray-400" />
        <div className="ml-auto">
          <Bookmark size={24} className="cursor-pointer hover:text-gray-400" />
        </div>
      </div>

      {/* Số lượt thích */}
      <div className="font-semibold mb-2">{likes} lượt thích</div>

      {/* Caption */}
      <div className="text-sm">
        <span className="font-semibold mr-2">{username}</span>
        <span className="text-gray-300">#ui #ux #webdev...</span>
      </div>

      {/* Xem bình luận */}
      <button className="text-gray-400 text-sm mt-1">
        Xem tất cả {comments} bình luận
      </button>

      {/* Input thêm bình luận */}
      <div className="flex items-center gap-2 mt-3 text-sm">
        <input
          type="text"
          placeholder="Bình luận…"
          className="flex-1 bg-transparent border-none outline-none text-gray-300"
        />
      </div>
    </div>
  );
}

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
