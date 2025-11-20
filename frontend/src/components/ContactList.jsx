import { useEffect } from "react";
import { useChatStore } from "../store/chat.store";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";

const ContactList = () => {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } =
    useChatStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div
            // className={`avatar ${
            //   onlineUsers.includes(contact._id) ? "online" : "offline"
            // }`}
            >
              <div className="size-14 rounded-full overflow-hidden object-cover">
                <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName || "Contact avatar"} />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
          </div>
        </div>
      ))}
    </>
  );
};

export default ContactList;
