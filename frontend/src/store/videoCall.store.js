import { create } from "zustand";

export const useVideoCallStore = create((set, get) => ({

  callStatus: null,

  pendingCall: null, 

  isWaitingModalOpen: false,

  timeoutId: null,

  setCallStatus: (status) => {
    set({ callStatus: status });
  },

  startWaiting: (callInfo) => {
    set({
      callStatus: "waiting",
      pendingCall: callInfo,
      isWaitingModalOpen: true,
    });
  },

  clearWaiting: () => {
    const { timeoutId } = get();
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    set({
      callStatus: null,
      pendingCall: null,
      isWaitingModalOpen: false,
      timeoutId: null,
    });
  },

  setTimeoutId: (id) => {
    set({ timeoutId: id });
  },

  startCall: (callId) => {
    const { timeoutId } = get();
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    set({
      callStatus: "active",
      pendingCall: null,
      isWaitingModalOpen: false,
      timeoutId: null,
    });
  },

  endCall: () => {
    const { timeoutId } = get();
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    set({
      callStatus: null,
      pendingCall: null,
      isWaitingModalOpen: false,
      timeoutId: null,
    });
  },
}));
