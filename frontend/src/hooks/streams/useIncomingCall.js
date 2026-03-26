import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useStreamVideo } from "./useStreamVideo";
import { useAuthStore } from "@/store/auth.store";

export const useIncomingCall = () => {
  const [incomingCall, setIncomingCall] = useState(null); 
  const { client } = useStreamVideo(); 
  const { authUser, socket } = useAuthStore();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!socket || !authUser?._id) return;

    const handleIncomingCall = (data) => {
      const { callId, caller, timestamp } = data;

      setIncomingCall({
        callId,
        caller,
        timestamp,
      });

      timeoutRef.current = setTimeout(() => {
        rejectCall();
        toast.error("Cuộc gọi đã kết thúc do không phản hồi");
      }, 60000);
    };

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

    socket.on("incoming_video_call", handleIncomingCall);
    socket.on("video_call_cancelled", handleCallCancelled);

    return () => {
      socket.off("incoming_video_call", handleIncomingCall);
      socket.off("video_call_cancelled", handleCallCancelled);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [socket, authUser?._id]);

  const acceptCall = async () => {
    if (!incomingCall || !socket || !client) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {

      socket.emit("video_call_accepted", {
        callId: incomingCall.callId,
        from: incomingCall.caller._id,
        acceptedBy: authUser._id,
      });

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

      navigate(`/streams/${incomingCall.callId}`);
      setIncomingCall(null);
    } catch (error) {
      console.error("Lỗi khi chấp nhận cuộc gọi:", error);
      toast.error("Không thể tham gia cuộc gọi");
      setIncomingCall(null);
    }
  };

  const rejectCall = () => {
    if (!incomingCall || !socket) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    socket.emit("video_call_rejected", {
      callId: incomingCall.callId,
      from: incomingCall.caller._id,
      rejectedBy: authUser._id,
    });

    setIncomingCall(null);
  };

  return { incomingCall, acceptCall, rejectCall };
};
