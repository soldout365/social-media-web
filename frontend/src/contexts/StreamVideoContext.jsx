import { createContext, useEffect, useRef, useState } from "react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useGetStreamToken } from "@/hooks/streams/useGetStreamToken";
import { useAuthStore } from "@/store/auth.store";
import toast from "react-hot-toast";

export const StreamVideoContext = createContext(null);

export const StreamVideoProvider = ({ children }) => {
  const [client, setClient] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const { authUser } = useAuthStore(); 
  const { data: tokenData } = useGetStreamToken(); 
  const clientRef = useRef(null); 

  useEffect(() => {

    if (!tokenData || !authUser) {

      if (
        clientRef.current &&
        typeof clientRef.current.disconnectUser === "function"
      ) {
        clientRef.current.disconnectUser().catch(console.error);
      }
      clientRef.current = null;
      setClient(null);
      setIsLoading(false);
      return;
    }

    let isCancelled = false; 

    const initClient = async () => {
      setIsLoading(true);

      try {

        const user = {
          id: authUser._id,
          name: authUser.fullName || authUser.username || authUser.email,
          image: authUser.profilePic,
        };

        const instance = new StreamVideoClient({
          apiKey: import.meta.env.VITE_STREAM_API_KEY,
          token: tokenData, 
          user,
        });

        clientRef.current = instance; 

        if (!isCancelled) {
          setClient(instance);
        }
      } catch (error) {
        console.error("Lỗi khởi tạo Stream client:", error);
        toast.error("Lỗi khởi tạo Stream client");
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    initClient();

    return () => {
      isCancelled = true;
      const currentClient = clientRef.current;

      if (currentClient && typeof currentClient.disconnectUser === "function") {
        currentClient.disconnectUser().catch((err) => {
          console.error("Stream client disconnect:", err.message);
          toast.error("Lỗi ngắt kết nối Stream client");
        });
      }
    };
  }, [tokenData, authUser?._id]); 

  return (
    <StreamVideoContext.Provider value={{ client, isLoading }}>
      {children}
    </StreamVideoContext.Provider>
  );
};
