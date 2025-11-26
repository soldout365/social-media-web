import { createContext, useEffect, useRef, useState } from "react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useGetStreamToken } from "@/hooks/streams/useGetStreamToken";
import { useAuthStore } from "@/store/auth.store";

// Context để chia sẻ StreamVideoClient toàn app
export const StreamVideoContext = createContext(null);

export const StreamVideoProvider = ({ children }) => {
  const [client, setClient] = useState(null); // StreamVideoClient instance - dùng chung cho tất cả cuộc gọi
  const [isLoading, setIsLoading] = useState(true);
  const { authUser } = useAuthStore(); // Thông tin user hiện tại
  const { data: tokenData } = useGetStreamToken(); // Token từ backend để xác thực với Stream API
  const clientRef = useRef(null); // Ref để lưu client instance cho cleanup

  useEffect(() => {
    // Nếu chưa có token hoặc chưa đăng nhập → cleanup client cũ và reset
    if (!tokenData || !authUser) {
      // Disconnect client cũ nếu có
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

    let isCancelled = false; // Flag để tránh set state sau khi component unmount

    const initClient = async () => {
      setIsLoading(true);

      try {
        // Chuẩn bị thông tin user cho Stream SDK
        const user = {
          id: authUser._id,
          name: authUser.fullName || authUser.username || authUser.email,
          image: authUser.profilePic,
        };

        // Tạo StreamVideoClient - CHỈ TẠO MỘT LẦN cho mỗi user session
        const instance = new StreamVideoClient({
          apiKey: import.meta.env.VITE_STREAM_API_KEY,
          token: tokenData, // Token JWT từ backend
          user,
        });

        clientRef.current = instance; // Lưu vào ref để cleanup

        // Chỉ set state nếu effect chưa bị cleanup (tránh warning)
        if (!isCancelled) {
          setClient(instance);
        }
      } catch (error) {
        console.error("Error initializing Stream client:", error);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    initClient();

    // Cleanup: disconnect client khi token/user thay đổi hoặc unmount
    return () => {
      isCancelled = true;
      const currentClient = clientRef.current;

      if (currentClient && typeof currentClient.disconnectUser === "function") {
        currentClient.disconnectUser().catch((err) => {
          console.log("Stream client disconnect:", err.message);
        });
      }
    };
  }, [tokenData, authUser?._id]); // Re-run khi token hoặc user ID thay đổi

  return (
    <StreamVideoContext.Provider value={{ client, isLoading }}>
      {children}
    </StreamVideoContext.Provider>
  );
};
