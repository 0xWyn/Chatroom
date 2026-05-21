import { createContext, useContext, useState, useEffect, useRef } from "react";
import API from "../services/axiosInterceptor";
import io from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    //
    const [postsById, setPostsById] = useState({});
    const [feedPostIds, setFeedPostIds] = useState([]);

    const [feedPage, setFeedPage] = useState(1);
    const [hasMorePosts, setHasMorePosts] = useState(true);
    const [loadingPosts, setLoadingPosts] = useState(false);
    //
    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem("user"))
    );
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);
    //
    const [chatNotifications, setChatNotifications] = useState({});

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;
        if (socketRef.current) {
            socketRef.current.disconnect();
        }

        const newSocket = io("http://localhost:3001");

        socketRef.current = newSocket;
        setSocket(newSocket);
        newSocket.on("connect", () => {
            console.log("Connection established", newSocket.id);
            newSocket.emit("join", user.id);
        });

        return () => {
            newSocket.disconnect();
            socketRef.current = null;
            setSocket(null);
        };
    }, [user]);

    useEffect(() => {
        if (!socket) return;

        const handleNewPost = (post) => {
            setPostsById((prev) => ({ ...prev, [post.id]: post }));
            setFeedPostIds((prev) => {
                if (prev.includes(post.id)) return prev;
                return [post.id, ...prev];
            });
        };

        const handleDeletedPost = (post) => {
            setFeedPostIds((prev) => prev.filter((id) => id !== post.id));
            setPostsById((prev) => {
                const copy = { ...prev };
                delete copy[post.id];
                return copy;
            });
        };

        const handleLikedPost = (post) => {
            setPostsById((prev) => ({ ...prev, [post.id]: post }));
        };

        const handleUnlikedPost = (post) => {
            setPostsById((prev) => ({ ...prev, [post.id]: post }));
        };

        const handleUpdatedPost = (post) => {
            handleLikedPost(post);
        };

        const handleMessageNotification = (notification) => {
            console.log("Handling that shit");

            const chatId = notification.chatId;

            setChatNotifications((prev) => {
                const existing = prev[chatId] || {
                    unreadCount: 0,
                    notifications: [],
                };

                return {
                    ...prev,
                    [chatId]: {
                        unreadCount: existing.unreadCount + 1,
                        notifications: [
                            ...existing.notifications,
                            notification.id,
                        ],
                    },
                };
            });
        };

        socket.on("message_notification", handleMessageNotification);
        socket.on("new_post", handleNewPost);
        socket.on("deleted_post", handleDeletedPost);
        socket.on("liked_post", handleLikedPost);
        socket.on("unliked_post", handleUnlikedPost);
        socket.on("updated_post", handleUpdatedPost);
        return () => {
            socket.off("message_notification", handleMessageNotification);
            socket.off("new_post", handleNewPost);
            socket.off("deleted_post", handleDeletedPost);
            socket.off("liked_post", handleLikedPost);
            socket.off("unliked_post", handleUnlikedPost);
            socket.off("updated_post", handleUpdatedPost);
        };
    }, [socket]);

    const fetchFeedPosts = async (pageNumber = 1) => {
        if (loadingPosts || !hasMorePosts) return;

        setLoadingPosts(true);
        const { data } = await API.get(`posts?page=${pageNumber}&limit=20`);

        if (data.length === 0) {
            setHasMorePosts(false);
            setLoadingPosts(false);
            return;
        }

        setPostsById((prev) => {
            const map = { ...prev };

            data.forEach((post) => {
                map[post.id] = post;
            });

            return map;
        });

        setFeedPostIds((prev) => {
            const newIds = data.map((p) => p.id);
            return [...new Set([...prev, ...newIds])];
        });

        setFeedPage(pageNumber);
        setLoadingPosts(false);
    };

    useEffect(() => {
        fetchFeedPosts(1);
    }, []);

    //Focus here
    useEffect(() => {
        if (!user) return;

        const fetchNotifcations = async () => {
            const { data } = await API.get(`notifications/${user.id}`);
            setNotifications(data);
        };

        const fetchChatNotifications = async () => {
            const { data } = await API.get(`notifications/${user.id}/messages`);

            setChatNotifications(() => {
                const map = {};

                data.forEach((notification) => {
                    const chatId = notification.chatId;

                    if (!map[chatId]) {
                        map[chatId] = {
                            unreadCount: 0,
                            notifications: [],
                        };
                    }

                    map[chatId].unreadCount += 1;
                    map[chatId].notifications.push(notification.id);
                });

                return map;
            });
        };

        fetchChatNotifications();
        fetchNotifcations();
    }, [user]);

    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    const refreshUser = async () => {
        try {
            const response = await API.get(`users/${user.id}`);
            const updatedUser = response.data;

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
                feedPostIds,
                postsById,
                refreshUser,
                notifications,
                setNotifications,
                socket,
                chatNotifications,
                setChatNotifications,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
