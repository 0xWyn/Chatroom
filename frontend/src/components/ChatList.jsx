import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider.jsx";
import API from "../services/axiosInterceptor.js";
import ChatCard from "./ChatCard.jsx";

export default function ChatList() {
    const { user: currentUser, chatNotifications } = useUser();
    const [friends, setFriends] = useState([]);
    const [chatsById, setChatsById] = useState({});

    useEffect(() => {
        if (!Object.values(chatNotifications).length) return;

        console.log(chatNotifications);
    }, [chatNotifications]);
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const { data } = await API.get(`users/${currentUser.id}/chats`);

                setChatsById((prev) => {
                    const map = { ...prev };
                    data.forEach((chat) => (map[chat.id] = chat));
                    return map;
                });
            } catch (error) {
                console.error(error);
            }
        };
        fetchChats();
    }, [currentUser]);

    return (
        <div className="shadow-md h-full w-full max-w-2xl p-2 flex justify-center bg-white rounded-md border-gray-300">
            <div className="w-full h-full flex flex-col items-center gap-2 rounded-3xl p-2">
                {Object.values(chatsById).length > 0 &&
                    Object.values(chatsById).map((chat) => (
                        <ChatCard
                            key={chat.id}
                            chat={chat}
                            unread={chatNotifications[chat.id]?.unreadCount}
                        />
                    ))}
            </div>
        </div>
    );
}
