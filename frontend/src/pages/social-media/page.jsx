import React from "react";
import Posts from "./post/Posts";
import RightSidebar from "./components/RightSidebar";

export default function SocialMediaPage() {
  return (
    <div className="flex gap-30 py-8 px-20 xl:px-4">
      {/* FEED (Stories + Posts) */}
      <div className="w-full max-w-xl mx-auto">
        {/* Stories - Thanh trượt ngang */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <Story username="sim_bs0707" />
          <Story username="chotutufan" />
          <Story username="pharacoolboy" />
          <Story username="naxisneaker" />
          <Story username="t1lol" />
          <Story username="jenlisa" />
          <Story username="mark_zuckerberg" />
          <Story username="cristiano" />
          <Story username="natgeo" />
          <Story username="therock" />
        </div>
        {/* Posts */}
        <Posts />
      </div>

      {/* SIDEBAR BÊN PHẢI - Scroll cùng với posts */}
      <div className="hidden xl:block w-full max-w-sm flex-shrink-0 mt-8 ">
        <RightSidebar />
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
