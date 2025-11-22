import { useChatStore } from "../store/chat.store.js";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer.jsx";
import ActiveTabSwitch from "../components/chats/ActiveTabSwitch.jsx";
import ChatsList from "../components/chats/ChatsList.jsx";
import ContactList from "../components/chats/ContactList.jsx";
import ChatContainer from "../components/chats/ChatContainer.jsx";
import NoConversationPlaceholder from "../components/chats/NoConversationPlaceholder.jsx";
import ProfileHeader from "../components/me/ProfileHeader.jsx";

function ChatPage() {
  const { activeTab, selectedUser } = useChatStore();

  return (
    <div className="relative w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />

          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}
export default ChatPage;
