import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http:

export const useAuthStore = create((set, get) => ({
  authUser: null,

  isCheckingAuth: true,

  isSigningUp: false,

  isLoggingIn: false,

  socket: null,

  onlineUsers: [],

  likeNotification: [],

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, 
    });
    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("notification", (notification) => {
      const currentNotifications = get().likeNotification;

      if (notification.type === "like") {
        set({ likeNotification: [...currentNotifications, notification] });
      } else if (notification.type === "dislike") {
        set({
          likeNotification: currentNotifications.filter(
            (item) => item.userId !== notification.userId,
          ),
        });
      }
    });
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.error("Lỗi kiểm tra xác thực:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });

      toast.success("Tạo tài khoản thành công!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      toast.success("Đăng nhập thành công!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Cập nhật hồ sơ thành công");
    } catch (error) {
      console.error("Lỗi cập nhật hồ sơ:", error);
      toast.error("Cập nhật hồ sơ thất bại. Vui lòng thử lại.");
    }
  },

  disconnectSocket: () => {
    const socket = get().socket;

    if (!socket) return;

    if (socket.connected) socket.disconnect();

    socket.off("getOnlineUsers"); 
    socket.off("notification"); 

    set({ socket: null, onlineUsers: [], likeNotification: [] });
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Đăng xuất thành công!");
      get().disconnectSocket();
    } catch (error) {
      console.error(error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại.");
    }
  },

  addLikeNotification: (notification) => {
    const currentNotifications = get().likeNotification;
    set({ likeNotification: [...currentNotifications, notification] });
  },
  clearAllNotifications: () => {
    set({ likeNotification: [] });
  },
}));
