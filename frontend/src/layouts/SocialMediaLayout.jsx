import React from "react";
import { Outlet } from "react-router-dom";
import LeftSidebar from "@/pages/social-media/components/LeftSidebar";

export default function SocialMediaLayout() {
  return (
    <div className="flex h-screen bg-[#0A1014] text-white">
      <div className="w-[15.5%] flex-shrink-0 border-r border-gray-800">
        <LeftSidebar />
      </div>

      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}
