import { useEffect, useRef } from "react";
import API from "../services/axiosInterceptor";

export const useChatSocket = (socket, activeChat, setMessages) => {
    const activeChatRef = useRef(null);
    useEffect(() => {
        activeChatRef.current = activeChat;
    }, [activeChat]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (msg) => {
            if (msg.chatId !== activeChatRef.current?.id) return;
            setMessages((prev) => [...prev, msg]);
        };

        const handleDeletedMessage = (msg) => {
            if (msg.chatId !== activeChatRef.current?.id) return;
            setMessages((prev) => prev.filter((m) => m.id !== msg.id));
        };

        const handleMessageNotification = async (notification) => {
            if (notification.chatId !== activeChatRef.current) return;
            await API.patch(`notifications/${notification.id}/read`);
        };

        socket.on("new_message", handleNewMessage);
        socket.on("message_notification", handleMessageNotification);
        socket.on("deleted_message", handleDeletedMessage);
        return () => {
            socket.off("message_notification", handleMessageNotification);
            socket.off("new_message", handleNewMessage);
            socket.off("deleted_message", handleDeletedMessage);
        };
    }, [socket, setMessages]);

    useEffect(() => {
        if (!socket || !activeChat?.id) return;

        socket.emit("join_chat", activeChat.id);

        return () => {
            socket.emit("leave_chat", activeChat.id);
        };
    }, [socket, activeChat?.id]);

    useEffect(() => {
        if (!socket) return;

        const reconnect = () => {
            if (activeChatRef.current?.id) {
                socket.emit("join_chat", activeChatRef.current.id);
            }
        };

        socket.on("connect", reconnect);

        return () => socket.off("connect", reconnect);
    }, [socket]);
};
