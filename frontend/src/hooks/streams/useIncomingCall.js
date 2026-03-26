import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useStreamVideo } from "./useStreamVideo";
import { useAuthStore } from "@/store/auth.store";

export const useIncomingCall = () => {
  const [incomingCall, setIncomingCall] = useState(null); // Lưu thông tin cuộc gọi đến
  const { client } = useStreamVideo(); // StreamVideoClient từ Context
  const { authUser, socket } = useAuthStore();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!socket || !authUser?._id) return;

    // ============================================
    // SOCKET LISTENERS (thay thế Stream events)
    // ============================================

    // Handler: Nhận invitation từ caller
    const handleIncomingCall = (data) => {
      const { callId, caller, timestamp } = data;

      // Lưu thông tin cuộc gọi để hiển thị modal
      setIncomingCall({
        callId,
        caller,
        timestamp,
      });

      // Auto reject sau 60s nếu không có phản hồi
      timeoutRef.current = setTimeout(() => {
        rejectCall();
        toast.error("Cuộc gọi đã kết thúc do không phản hồi");
      }, 60000);
    };

    // Handler: Caller đã hủy cuộc gọi
    const handleCallCancelled = ({ callId }) => {
      setIncomingCall((prev) => {
        if (!prev || prev.callId !== callId) return prev;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        toast.error("Cuộc gọi đã bị hủy");
        return null;
      });
    };

    // Đăng ký listeners
    socket.on("incoming_video_call", handleIncomingCall);
    socket.on("video_call_cancelled", handleCallCancelled);

    // Cleanup
    return () => {
      socket.off("incoming_video_call", handleIncomingCall);
      socket.off("video_call_cancelled", handleCallCancelled);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [socket, authUser?._id]);

  // ============================================
  // CHẤP NHẬN CUỘC GỌI
  // ============================================
  const acceptCall = async () => {
    if (!incomingCall || !socket || !client) return;

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      // 1. Gửi signal accept đến caller qua socket
      socket.emit("video_call_accepted", {
        callId: incomingCall.callId,
        from: incomingCall.caller._id,
        acceptedBy: authUser._id,
      });

      // 2. Chờ caller tạo Stream call và nhận signal "call_ready"
      const waitForCallReady = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          socket.off("video_call_ready", handler);
          reject(new Error("Timeout waiting for call ready"));
        }, 15000);

        function handler({ callId }) {
          if (callId === incomingCall.callId) {
            clearTimeout(timeout);
            socket.off("video_call_ready", handler);
            resolve();
          }
        }

        socket.on("video_call_ready", handler);
      });

      await waitForCallReady;

      // 3. Navigate đến CallPage (CallPage sẽ load call và join)
      navigate(`/streams/${incomingCall.callId}`);
      setIncomingCall(null);
    } catch (error) {
      console.error("Lỗi khi chấp nhận cuộc gọi:", error);
      toast.error("Không thể tham gia cuộc gọi");
      setIncomingCall(null);
    }
  };

  // ============================================
  // TỪ CHỐI CUỘC GỌI
  // ============================================
  const rejectCall = () => {
    if (!incomingCall || !socket) return;

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Gửi signal reject qua socket (KHÔNG tạo Stream call)
    socket.emit("video_call_rejected", {
      callId: incomingCall.callId,
      from: incomingCall.caller._id,
      rejectedBy: authUser._id,
    });

    setIncomingCall(null);
  };

  return { incomingCall, acceptCall, rejectCall };
};
