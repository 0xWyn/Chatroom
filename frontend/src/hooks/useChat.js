import { useEffect, useState } from "react";
import { useUser } from "../context/UserProvider";
import API from "../services/axiosInterceptor";

export const useChat = (userId, receiverId) => {
    const { user } = useUser();
    const [receiver, setReceiver] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const { data: userData } = await API.get(`users/${receiverId}`);
            setReceiver(userData);

            const { data: chat } = await API.get(
                `chats/by-users/${receiverId}/${user.id}`
            );

            if (!chat) return;
            setActiveChat(chat);

            const { data: msgs } = await API.get(`chats/${chat.id}/messages`);
            setMessages(msgs);
        };

        fetch();
    }, [receiverId, user.id]);

    return {
        receiver,
        activeChat,
        messages,
        setMessages,
        setActiveChat,
    };
};
