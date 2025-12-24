import Home from "@/assets/home.svg?react"; //ko sai
import Search from "@/assets/search.svg?react"; //ko sai
import Heart from "@/assets/heart.svg?react"; //ko sai
import Create from "@/assets/create.svg?react"; //ko sai
import Explore from "@/assets/explore.svg?react"; //ko sai
import Messenger from "@/assets/messenger.svg?react"; //ko sai

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth.store.js";
import { useChatStore } from "@/store/chat.store.js";
import { useLocation, useNavigate } from "react-router-dom";
import CreatePost from "../post/CreatePost";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const LeftSidebar = () => {
  const location = useLocation(); // lấy đường dẫn hiện tại
  const { authUser, likeNotification, clearAllNotifications } = useAuthStore();
  const { setLogoutModalOpen } = useChatStore();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      setLogoutModalOpen(true);
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${authUser?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat-page");
    }
  };

  // Hàm check xem có đang active không
  const isActive = (text) => {
    if (text === "Home" && location.pathname === "/") return true;
    if (text === "Messages" && location.pathname === "/chat-page") return true;
    if (text === "Profile" && location.pathname.includes("/profile/"))
      return true;
    return false;
  };

  const sidebarItems = [
    {
      icon: <Home width={28} height={28} />,
      text: "Home",
    },
    { icon: <Search width={28} height={28} />, text: "Search" },
    { icon: <Explore width={28} height={28} />, text: "Explore" },
    { icon: <Messenger width={28} height={28} />, text: "Messages" },
    { icon: <Heart width={28} height={28} />, text: "Notifications" },
    { icon: <Create width={28} height={28} />, text: "Create" },
    {
      icon: (
        <Avatar width={28} height={28} className="w-7 h-7 ">
          <AvatarImage
            src={authUser?.profilePic || "/avatar.png"}
            alt="@shadcn"
            className="object-cover w-7 h-7 border-2 border-gray-50 rounded-full"
          />
          <AvatarFallback>Profile</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut width={28} height={28} />, text: "Logout" },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="w-60 border-gray-800 pl-[-20%] pr-14 py-3 flex flex-col">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-auto object-contain object-left mb-0 mt-6"
            style={{ aspectRatio: "auto" }}
          />
        </h1>
        <div>
          {sidebarItems.map((item, index) => {
            const active = isActive(item.text); // check active

            //phần notifications
            if (item.text === "Notifications" && likeNotification.length > 0) {
              return (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-3 relative hover:bg-gray-400 cursor-pointer rounded-lg p-2.5 my-3">
                      <div className={active ? "fill-white" : ""}>
                        {item.icon}
                      </div>
                      <span
                        className={
                          active
                            ? "font-bold bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent"
                            : ""
                        }
                      >
                        {item.text}
                      </span>
                      <Button
                        size="icon"
                        className="rounded-full h-4 w-4 bg-red-600 hover:bg-red-600 absolute bottom-6 left-7 pointer-events-none"
                      >
                        {likeNotification.length}
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[95%] max-w-[240px] bg-gray-900 border-gray-800 text-white shadow-xl z-50"
                    side="top"
                    align="start"
                    sideOffset={5}
                  >
                    <div className="max-h-[400px] overflow-y-auto">
                      {likeNotification.map((notification, index) => {
                        return (
                          <div
                            key={`${notification.userId}-${index}`}
                            className="flex items-center gap-3 p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={
                                  notification.userDetails?.profilePic ||
                                  "/avatar.png"
                                }
                                className="object-cover w-10 h-10 border-2 border-gray-700 rounded-full"
                              />
                              <AvatarFallback className="bg-gray-700 text-white">
                                {notification.userDetails?.fullName?.[0]?.toUpperCase() ||
                                  "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="text-sm">
                                <span className="font-bold text-white">
                                  {notification.userDetails?.fullName}
                                </span>{" "}
                                <span className="text-gray-400">
                                  {notification.message}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pt-3 mt-2">
                      <Button
                        onClick={clearAllNotifications}
                        variant="outline"
                        className="w-full bg-transparent border-gray-700 text-white hover:bg-gray-800 hover:text-white"
                      >
                        Xóa tất cả thông báo
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <div
                onClick={() => sidebarHandler(item.text)}
                key={index}
                className="flex items-center gap-3 relative hover:bg-gray-400 cursor-pointer rounded-lg p-2.5 my-3"
              >
                <div className={active ? "fill-white " : ""}> {item.icon}</div>
                <span
                  className={
                    active
                      ? "font-bold bg-gradient-to-tr from-yellow-400 to-pink-600 bg-clip-text text-transparent "
                      : ""
                  }
                >
                  {" "}
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
};

export default LeftSidebar;
