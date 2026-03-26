import { useRef, useState } from "react";
import { useAuthStore } from "../../store/auth.store";
import { useChatStore } from "../../store/chat.store";
import { VolumeOffIcon, Volume2Icon } from "lucide-react";
import { useClickSound } from "../../hooks/sounds/useSound";
import LogoutButton from "../me/LogoutButton.jsx";

const ProfileHeader = () => {
  //
  const { authUser, updateProfile, logout } = useAuthStore();

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
    <div className="p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/30 to-slate-900/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* AVATAR */}
          <div className="avatar online ">
            <button
              className="size-16 mt-0.5 rounded-full overflow-hidden relative group ring-2 ring-slate-600/50 hover:ring-blue-500/50 transition-all duration-300"
              onClick={() => fileInputRef.current.click()}
            >
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="User Image"
                className="size-full object-cover transition-transform group-hover:scale-110 duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                <span className="text-white text-sm font-medium">Change</span>
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
          <div className="flex flex-col gap-1">
            <h3 className="text-slate-100 font-semibold text-lg max-w-[180px] truncate">
              {authUser?.fullName}
            </h3>

            <p className="text-emerald-400 text-sm flex items-center gap-1.5">
              <span className="size-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Online
            </p>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 items-center">
          {/* SOUND TOGGLE BTN */}
          <button
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
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
  );
};

export default ProfileHeader;
