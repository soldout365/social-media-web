import { useRef, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { useChatStore } from "../store/chat.store";
import { VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useClickSound } from "../hooks/sounds/useSound";
import LogoutButton from "./LogoutButton";

const ProfileHeader = () => {
  //
  const { logout, authUser, updateProfile } = useAuthStore();

  const { isSoundEnabled, toggleSound } = useChatStore();

  const [selectedImg, setSelectedImg] = useState(null);

  const playClick = useClickSound();

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      await updateProfile({ profilePic: base64Image });
      setSelectedImg(base64Image);
      //bien gui len phai khop voi backend
    };
  };

  //

  return (
    <div className="p-6 border-b border-slate-700/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* AVATAR */}
          <div className="avatar online">
            <button
              className="size-14 rounded-full overflow-hidden relative group"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="User Image"
                className="size-full object-cover"
              />

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-white text-xs">Change</span>
              </div>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* USERNAME & ONLINE TEXT */}
          <div>
            <h3 className="text-slate-200 font-medium text-base max-w-[180px] truncate">
              {authUser?.fullName}
            </h3>

            <p className="text-slate-400 text-xs">Online</p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 items-center ml-20">
            {/* SOUND TOGGLE BTN */}
            <button
              className="text-slate-400 hover:text-slate-200 transition-colors mr-1"
              onClick={() => {
                playClick();
                toggleSound();
              }}
            >
              {isSoundEnabled ? (
                <Volume2Icon className="size-5" />
              ) : (
                <VolumeOffIcon className="size-5" />
              )}
            </button>

            {/* LOGOUT BTN */}
            <LogoutButton logout={logout} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
