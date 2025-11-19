import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  allContacts: [],

  chats: [],

  messages: [],

  activetab: "chats",

  selectedUser: null,

  isUsersLoading: false,

  isMessagesLoading: false,

  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;

    localStorage.setItem("isSoundEnabled", newValue);
    set({ isSoundEnabled: newValue });
  },

  setActiveTab: (tab) => set({ activetab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      toast.error("Failed to load contacts");
      console.log(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {},
}));
