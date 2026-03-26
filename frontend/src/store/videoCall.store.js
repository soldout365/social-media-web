import { create } from "zustand";

/**
 * Video Call State Store
 * Quản lý trạng thái cuộc gọi video: waiting, active
 */
export const useVideoCallStore = create((set, get) => ({
  // Call status: null | 'waiting' | 'connecting' | 'active'
  callStatus: null,

  // Pending call info khi đang đợi callee accept
  pendingCall: null, // { callId, peer: { _id, fullName, profilePic }, timestamp }

  // Waiting modal visibility
  isWaitingModalOpen: false,

  // Timeout ID để có thể cancel
  timeoutId: null,

  // Set call status
  setCallStatus: (status) => {
    set({ callStatus: status });
  },

  // Start waiting (khi caller gửi request)
  startWaiting: (callInfo) => {
    set({
      callStatus: "waiting",
      pendingCall: callInfo,
      isWaitingModalOpen: true,
    });
  },

  // Clear waiting state
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

  // Set timeout ID
  setTimeoutId: (id) => {
    set({ timeoutId: id });
  },

  // Start call (khi cả 2 đã sẵn sàng)
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

  // End call
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
