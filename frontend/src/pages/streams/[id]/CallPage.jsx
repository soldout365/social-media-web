
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useStreamVideo } from "@/hooks/streams/useStreamVideo"; 

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
  const { id: callId } = useParams(); 
  const { client } = useStreamVideo(); 
  const [call, setCall] = useState(null); 
  const [isConnecting, setIsConnecting] = useState(true); 

  const callRef = useRef(null); 
  const joiningRef = useRef(false); 
  const joinedRef = useRef(false); 

  useEffect(() => {
    if (!client || !callId) {
      setIsConnecting(false);
      return;
    }

    const initCall = async () => {

      const callInstance = client.call("default", callId);

      callRef.current = callInstance;

      const currentState = callInstance.state.callingState;

      if (currentState === CallingState.JOINED || joinedRef.current) {
        joinedRef.current = true;
        setCall(callInstance);
        setIsConnecting(false);
        return;
      }

      if (joiningRef.current) {
        return;
      }

      joiningRef.current = true;
      setIsConnecting(true);

      try {

        try {
          await callInstance.get();
        } catch (error) {

          console.error(" Call not found, might be timing issue:", error);
          toast.error("Cuộc gọi không tồn tại hoặc đã kết thúc");
          joiningRef.current = false;
          setIsConnecting(false);
          return;
        }

        await callInstance.join({ create: false });

        toast.success("Kết nối đến cuộc gọi thành công");
        joinedRef.current = true; 
        setCall(callInstance); 
      } catch (error) {
        toast.error("Lỗi kết nối đến cuộc gọi");
        console.error("Error joining call:", error);
        callRef.current = null;
        joinedRef.current = false;
      } finally {
        joiningRef.current = false; 
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      const activeCall = callRef.current;

      if (activeCall && joinedRef.current) {

        const checkAndEndCall = async () => {
          try {
            const participants = activeCall.state.participants;
            const activeCount = Array.from(participants.values()).filter(
              (p) => p.connectionQuality !== "offline",
            ).length;

            if (activeCount <= 1) {
              await activeCall.endCall();
            } else {

              await activeCall.leave();
            }
          } catch (error) {
            console.error("Lỗi khi rời khỏi cuộc gọi:", error);

            activeCall.leave().catch(console.error);
          }
        };

        checkAndEndCall();
        joinedRef.current = false;
      }
      callRef.current = null;
    };
  }, [client, callId]); 

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

const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks(); 
  const callingState = useCallCallingState(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (callingState === CallingState.LEFT) {
      navigate("/"); 
    }
  }, [callingState, navigate]);

  return (
    <StreamTheme className="h-full">
      <SpeakerLayout /> {}
      <CallControls /> {}
    </StreamTheme>
  );
};

export default CallPage;
