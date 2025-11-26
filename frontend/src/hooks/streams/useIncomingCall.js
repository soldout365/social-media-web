import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useStreamVideo } from "./useStreamVideo";
import { useAuthStore } from "@/store/auth.store";

export const useIncomingCall = () => {
  const [incomingCall, setIncomingCall] = useState(null); // Lưu thông tin cuộc gọi đến
  const { client } = useStreamVideo(); // StreamVideoClient từ Context
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!client || !authUser?._id) return;

    // Handler: khi có cuộc gọi đến (event "call.ring")
    const handleIncomingCall = (event) => {
      const callerId = event.call.created_by.id;

      // Nếu người gọi là chính mình → bỏ qua (tránh hiển thị modal cho caller)
      if (callerId === authUser._id) return;

      // Lưu thông tin cuộc gọi để hiển thị modal
      setIncomingCall({
        callId: event.call.id, // ID duy nhất của cuộc gọi
        callType: event.call.type || "default", // Loại cuộc gọi
        caller: {
          name: event.call.created_by.name,
          image: event.call.created_by.image,
          id: event.call.created_by.id,
        },
      });
    };

    // Handler: khi cuộc gọi bị từ chối
    const handleCallRejected = (event) => {
      setIncomingCall((prev) => {
        // Chỉ đóng modal nếu đúng cuộc gọi đang hiển thị
        if (!prev || prev.callId !== event.call.id) return prev;
        return null;
      });
    };

    // Handler: khi cuộc gọi kết thúc
    const handleCallEnded = (event) => {
      setIncomingCall((prev) => {
        if (!prev || prev.callId !== event.call.id) return prev;
        return null;
      });
    };

    // Đăng ký listeners cho các event từ Stream SDK
    client.on("call.ring", handleIncomingCall); // Có cuộc gọi đến
    client.on("call.rejected", handleCallRejected); // Cuộc gọi bị từ chối
    client.on("call.ended", handleCallEnded); // Cuộc gọi kết thúc

    // Cleanup: gỡ bỏ listeners khi component unmount
    return () => {
      client.off("call.ring", handleIncomingCall);
      client.off("call.rejected", handleCallRejected);
      client.off("call.ended", handleCallEnded);
    };
  }, [client, authUser?._id]);

  // Chấp nhận cuộc gọi: chỉ navigate, việc join sẽ do CallPage xử lý
  const acceptCall = async () => {
    if (!incomingCall) return;

    try {
      // Chuyển đến trang CallPage với callId
      navigate(`/streams/${incomingCall.callId}`);
      setIncomingCall(null); // Đóng modal
    } catch (error) {
      console.error("Lỗi tham gia cuộc gọi:", error);
      toast.error("Không thể tham gia cuộc gọi");
    }
  };

  // Từ chối cuộc gọi: gọi API reject của Stream SDK
  const rejectCall = async () => {
    if (!incomingCall || !client) return;

    try {
      // Tạo call instance từ callId để có thể gọi reject()
      const callInstance = client.call(
        incomingCall.callType || "default",
        incomingCall.callId
      );
      await callInstance.reject(); // Gửi signal từ chối đến người gọi
    } catch (error) {
      console.error("Lỗi từ chối cuộc gọi:", error);
    } finally {
      setIncomingCall(null); // Đóng modal dù thành công hay thất bại
    }
  };

  return { incomingCall, acceptCall, rejectCall };
};
