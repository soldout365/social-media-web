import { useEffect, useRef } from "react";
import { useChatStore } from "../../store/chat.store";
import { useAuthStore } from "./../../store/auth.store";
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import MessageInput from "./MessageInput";

const ChatContainer = () => {
  //
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
  }, [selectedUser, getMessagesByUserId]);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages();

    // clean up
    return () => unsubscribeFromMessages();
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Group messages by sender and time proximity (within 2 minutes)
  const groupMessages = (messages) => {
    const groups = [];
    let currentGroup = null;

    messages.forEach((msg) => {
      const shouldStartNewGroup =
        !currentGroup ||
        currentGroup.senderId !== msg.senderId ||
        new Date(msg.createdAt) - new Date(currentGroup.lastMessageTime) >
          120000; // 2 minutes

      if (shouldStartNewGroup) {
        currentGroup = {
          senderId: msg.senderId,
          messages: [msg],
          lastMessageTime: msg.createdAt,
        };
        groups.push(currentGroup);
      } else {
        currentGroup.messages.push(msg);
        currentGroup.lastMessageTime = msg.createdAt;
      }
    });

    return groups;
  };

  const messageGroups = groupMessages(messages);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-950">
      <ChatHeader />
      <div className="flex-1 px-4 sm:px-6 overflow-y-auto py-6 sm:py-8 chat-background">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-4">
            {messageGroups.map((group, groupIndex) => (
              <div
                key={`group-${groupIndex}`}
                className={`flex ${
                  group.senderId === authUser._id
                    ? "flex-row-reverse"
                    : "flex-row"
                } gap-2 mr-[-1%]`}
              >
                <div className="chat-image avatar flex-shrink-0 self-end mb-1">
                  <div className="w-8 rounded-full ring-2 ring-offset-1 ring-offset-slate-900 ring-slate-600">
                    <img
                      src={
                        group.senderId === authUser._id
                          ? authUser.profilePic
                          : selectedUser.profilePic
                      }
                      alt="avatar"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1 max-w-[280px] sm:max-w-sm md:max-w-md">
                  {group.messages.map((msg, msgIndex) => (
                    <div
                      key={msg._id}
                      className={`px-3 py-2 shadow-md transition-all hover:shadow-lg ${
                        msgIndex === 0 && msgIndex === group.messages.length - 1
                          ? "rounded-2xl"
                          : msgIndex === 0
                          ? group.senderId === authUser._id
                            ? "rounded-t-2xl rounded-bl-2xl rounded-br-md"
                            : "rounded-t-2xl rounded-br-2xl rounded-bl-md"
                          : msgIndex === group.messages.length - 1
                          ? group.senderId === authUser._id
                            ? "rounded-b-2xl rounded-tl-2xl rounded-tr-md"
                            : "rounded-b-2xl rounded-tr-2xl rounded-tl-md"
                          : group.senderId === authUser._id
                          ? "rounded-l-2xl rounded-r-md"
                          : "rounded-r-2xl rounded-l-md"
                      } ${
                        group.senderId === authUser._id
                          ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white self-end"
                          : "bg-slate-800/90 text-slate-100 border border-slate-700/50 self-start"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Shared"
                          className="rounded-lg max-h-60 w-auto object-cover mb-2 shadow-sm"
                        />
                      )}
                      {msg.text && (
                        <p className="leading-snug text-sm break-words">
                          {msg.text}
                        </p>
                      )}
                      {msgIndex === group.messages.length - 1 && (
                        <p className="text-[10px] mt-1.5 opacity-50 flex items-center gap-1">
                          <svg
                            className="w-2.5 h-2.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {new Date(msg.createdAt).toLocaleTimeString(
                            undefined,
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <div className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <MessageInput />
      </div>
    </div>
  );
};

export default ChatContainer;
