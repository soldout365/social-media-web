import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import { useVideoCallStore } from "@/store/videoCall.store";
import { useIncomingCall } from "@/hooks/streams/useIncomingCall";
import BorderAnimatedContainer from "@/components/BorderAnimatedContainer";
import ActiveTabSwitch from "@/components/chats/status/ActiveTabSwitch";
import ChatsList from "@/components/chats/lists/ChatsList";
import ContactList from "@/components/chats/lists/ContactList";
import ChatContainer from "@/components/chats/ChatContainer";
import NoConversationPlaceholder from "@/components/chats/status/NoConversationPlaceholder";
import ProfileHeader from "@/components/me/ProfileHeader";
import IncomingCallModal from "@/components/modals/IncomingCallModal";
import WaitingCallModal from "@/components/modals/WaitingCallModal";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();
  const { incomingCall, acceptCall, rejectCall } = useIncomingCall();
  const { isWaitingModalOpen, clearWaiting, pendingCall } = useVideoCallStore();
  const { socket } = useAuthStore();

  // Handler để hủy cuộc gọi từ ChatPage
  const handleCancelCall = () => {
    if (!pendingCall || !socket) return;

    socket.emit("video_call_cancelled", {
      callId: pendingCall.callId,
      to: pendingCall.peer._id,
    });

    clearWaiting();
  };

  return (
    <div className="relative w-full max-w-6xl h-[800px] mx-auto">
      <BorderAnimatedContainer className="h-full w-full">
        <div className="h-full w-full flex overflow-hidden">
          {/* LEFT SIDE */}
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col flex-shrink-0">
            <ProfileHeader />
            <ActiveTabSwitch />
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 w-full flex flex-col bg-slate-900/50 backdrop-blur-sm border-l border-slate-700/50">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>

          {incomingCall && (
            <IncomingCallModal
              caller={{
                name: incomingCall.caller.name,
                image: incomingCall.caller.image,
              }}
              callId={incomingCall.callId}
              onAccept={acceptCall}
              onReject={rejectCall}
            />
          )}

          {isWaitingModalOpen && (
            <WaitingCallModal onCancel={handleCancelCall} />
          )}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
