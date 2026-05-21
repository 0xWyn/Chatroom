import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import { useChat } from "../hooks/useChat";
import { useChatSocket } from "../hooks/useChatSocket";
import API from "../services/axiosInterceptor";
import ChatHeader from "./ChatHeader";
import MediaPreviewModal from "./MediaPreviewModal";
import MessageMediaThumbnail from "./MessageMediaThumbnail";
import MessageContainer from "./NewMessageContainer";
import MessageInput from "./NewMessageInput";

export default function ChatPage() {
    const [activeChat, setActiveChat] = useState(null);
    const { id } = useParams();
    const { user, socket, chatNotifications, setChatNotifications } = useUser();
    const [messages, setMessages] = useState([]);
    const [receiver, setReceiver] = useState(null);
    const [isAtBottom, setIsAtBottom] = useState(false);

    const notifications = chatNotifications[id]?.notifications || [];

    useEffect(() => {
        const fetchChat = async () => {
            try {
                const { data } = await API.get(`chats/${id}`);
                setActiveChat(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchChat();
    }, [id]);

    useEffect(() => {
        if (!activeChat) return;
        setReceiver(() =>
            activeChat.participants.find((u) => u.id !== user.id)
        );
    }, [activeChat]);

    useChatSocket(socket, activeChat, setMessages);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await API.get(`chats/${id}/messages`);
                setMessages(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchMessages();
    }, [id]);

    useEffect(() => {
        const readMessages = async () => {
            try {
                if (!notifications.length || !activeChat) return;

                await Promise.all(
                    notifications.map((id) =>
                        API.patch(`notifications/${id}/read`)
                    )
                );

                setChatNotifications((prev) => ({
                    ...prev,
                    [id]: {
                        unreadCount: 0,
                        notifications: [],
                    },
                }));
            } catch (error) {
                console.error(error);
            }
        };

        readMessages();
    }, [activeChat, notifications]);

    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const [messageMedia, setMessageMedia] = useState(null);
    const fileInputRef = useRef(null);

    const sendMessage = async (e) => {
        e.preventDefault();

        try {
            const formdata = new FormData();
            let chat = activeChat;
            if (!chat) {
                const body = { participants: [user.id, receiver.id] };
                const { data } = await API.post("chats", body);
                chat = data;
                setActiveChat(chat);
            }
            formdata.append("chatId", chat.id);
            if (text.trim()) {
                formdata.append("text", text);
            }
            if (messageMedia) {
                formdata.append("media", messageMedia.file);
            }
            formdata.append(
                "sender",
                JSON.stringify({
                    id: user.id,
                    avatar: user.avatar,
                })
            );
            formdata.append("receiverId", receiver.id);
            const response = await API.post("messages", formdata);
            setText("");
            if (messageMedia?.url) URL.revokeObjectURL(messageMedia.url);
            setMessageMedia(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteMessage = async (msg) => {
        try {
            await API.delete(`messages/${msg.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    if (!receiver) {
        return <div>Loading...</div>;
    }

    const acceptFile = () => {
        console.log("Accepted");
        setMessageMedia(file);
        setFile(null);
    };

    const rejectFile = () => {
        console.log("Rejected");
        if (file?.url) URL.revokeObjectURL(file.url);

        console.log("file after revoking url:", file);
        setMessageMedia(null);
        setFile(null);
    };

    if (!activeChat) return <div>Loading...</div>;

    return (
        <div className="flex flex-col border bg-white border-gray-300 h-full min-h-0 rounded-md p-3 w-full">
            <ChatHeader user={receiver} />
            {file && (
                <MediaPreviewModal
                    previewObject={file}
                    onAccept={acceptFile}
                    onReject={rejectFile}
                />
            )}
            <MessageContainer
                thread={messages}
                onDelete={deleteMessage}
                setIsAtBottom={setIsAtBottom}
            />
            <div className="flex gap-2">
                {messageMedia && (
                    <MessageMediaThumbnail
                        previewObject={messageMedia}
                        onClick={() => setFile(messageMedia)}
                    />
                )}
                <MessageInput
                    fileInputRef={fileInputRef}
                    text={text}
                    setText={setText}
                    onSubmit={sendMessage}
                    setFile={setFile}
                />
            </div>
        </div>
    );
}
