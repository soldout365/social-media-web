// src/pages/CallPage.jsx - SỬA LẠI
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useStreamVideo } from "@/hooks/streams/useStreamVideo"; // ← THÊM

import {
  StreamVideo,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const CallPage = () => {
  const { id: callId } = useParams(); // Lấy callId từ URL
  const { client } = useStreamVideo(); // StreamVideoClient từ Context (đã khởi tạo sẵn)
  const [call, setCall] = useState(null); // Call instance sau khi join thành công
  const [isConnecting, setIsConnecting] = useState(true); // Loading state

  // Refs để tracking trạng thái join - tránh join nhiều lần
  const callRef = useRef(null); // Lưu call instance để cleanup
  const joiningRef = useRef(false); // Đang trong quá trình join
  const joinedRef = useRef(false); // Đã join thành công

  useEffect(() => {
    if (!client || !callId) {
      setIsConnecting(false);
      return;
    }

    const initCall = async () => {
      // Tạo call instance từ callId
      const callInstance = client.call("default", callId);

      callRef.current = callInstance;

      // Kiểm tra trạng thái hiện tại của call
      const currentState = callInstance.state.callingState;

      // Guard 1: Nếu đã join rồi → không join nữa, chỉ set state
      if (currentState === CallingState.JOINED || joinedRef.current) {
        joinedRef.current = true;
        setCall(callInstance);
        setIsConnecting(false);
        return;
      }

      // Guard 2: Nếu đang join dở → thoát (tránh join trùng do StrictMode)
      if (joiningRef.current) {
        return;
      }

      // Đánh dấu bắt đầu join
      joiningRef.current = true;
      setIsConnecting(true);

      try {
        // ============================================
        // LOAD call thay vì tạo mới (call đã được tạo bởi caller)

        try {
          await callInstance.get();
        } catch (error) {
          // Nếu call chưa tồn tại (edge case), log error
          console.error(" Call not found, might be timing issue:", error);
          toast.error("Cuộc gọi không tồn tại hoặc đã kết thúc");
          joiningRef.current = false;
          setIsConnecting(false);
          return;
        }

        // JOIN VÀO CUỘC GỌI (create: false vì đã tạo rồi)
        await callInstance.join({ create: false });

        toast.success("Kết nối đến cuộc gọi thành công");
        joinedRef.current = true; // Đánh dấu đã join
        setCall(callInstance); // Lưu call để render UI
      } catch (error) {
        toast.error("Lỗi kết nối đến cuộc gọi");
        console.error("Error joining call:", error);
        callRef.current = null;
        joinedRef.current = false;
      } finally {
        joiningRef.current = false; // Reset flag
        setIsConnecting(false);
      }
    };

    initCall();

    // Cleanup: khi unmount hoặc callId/client thay đổi
    return () => {
      const activeCall = callRef.current;

      // Chỉ leave nếu đã join thành công (tránh leave khi join dở)
      if (activeCall && joinedRef.current) {
        // Kiểm tra số participants trước khi leave
        const checkAndEndCall = async () => {
          try {
            const participants = activeCall.state.participants;
            const activeCount = Array.from(participants.values()).filter(
              (p) => p.connectionQuality !== "offline"
            ).length;

            // Nếu là người cuối cùng → end call thay vì leave
            if (activeCount <= 1) {
              await activeCall.endCall();
            } else {
              // Vẫn còn người khác → chỉ leave
              await activeCall.leave();
            }
          } catch (error) {
            console.error("Lỗi khi rời khỏi cuộc gọi:", error);

            // Fallback: leave anyway
            activeCall.leave().catch(console.error);
          }
        };

        checkAndEndCall();
        joinedRef.current = false;
      }
      callRef.current = null;
    };
  }, [client, callId]); // Re-run khi client hoặc callId thay đổi

  if (isConnecting)
    return (
      <div className="flex items-center justify-center h-screen text-white text-2xl">
        <p>Đang kết nối ...</p>
      </div>
    );

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative w-full h-full">
        {call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>
              Không thể khởi tạo cuộc gọi. Vui lòng làm mới hoặc thử lại sau.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Component hiển thị UI cuộc gọi và xử lý khi người dùng leave
const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks(); // Hook từ Stream SDK
  const callingState = useCallCallingState(); // Trạng thái cuộc gọi realtime
  const navigate = useNavigate();

  // Theo dõi trạng thái: nếu user bấm "End Call" → callingState = LEFT
  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/"); // Tự động quay về trang home
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme className="h-full">
      <SpeakerLayout /> {/* Layout hiển thị video của participants */}
      <CallControls /> {/* Nút điều khiển: mute, camera, end call */}
    </StreamTheme>
  );
};

export default CallPage;
