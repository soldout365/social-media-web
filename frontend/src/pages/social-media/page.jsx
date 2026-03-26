import React from "react";
import Posts from "./post/Posts";
import RightSidebar from "./components/RightSidebar";
import { Stories } from "./story/components/Stories";
import { AppProvider } from "./story/contexts/context";
import { StoryPortal } from "./story/components/StoryPortal/StoryPotal";

export default function SocialMediaPage() {
  return (
    <div className="flex justify-center min-h-screen bg-black text-white p-4">
      {/* FEED (Stories + Posts) */}
      <div className="w-full max-w-xl mx-auto">
        {/* Stories - Thanh trượt ngang */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <AppProvider>
            <Stories />
            <StoryPortal />
          </AppProvider>
        </div>
        {/* Posts */}
        <Posts />
      </div>
      <div className="hidden xl:block w-full max-w-sm flex-shrink-0 mt-8 ">
        <RightSidebar />
      </div>
    </div>
  );
}
