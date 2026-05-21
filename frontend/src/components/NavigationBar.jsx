import { Link, useLocation } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import { useState, useEffect } from "react";

export default function NavigationBar({ onLogout }) {
    const { notifications, chatNotifications } = useUser();
    const [isNewMessage, setIsNewMessage] = useState(false);
    const location = useLocation();

    const sections = [
        { location: "home" },
        { location: "messages" },
        { location: "notifications" },
        { location: "search" },
        { location: "profile" },
        { location: "settings" },
    ];

    useEffect(() => {
        if (!Object.values(chatNotifications)) return;

        const newMessage = Object.values(chatNotifications).some(
            (n) => n.unreadCount > 0
        );
        setIsNewMessage(newMessage);
    }, [chatNotifications]);

    const newNotifications = notifications.reduce((count, notif) => {
        return notif.read ? count : count + 1;
    }, 0);

    const current = location.pathname.split("/")[1] || "home";
    return (
        <div className="flex flex-col justify-between gap-10 py-2">
            <div className="flex flex-col gap-4 justify-center">
                {sections.map((section) => (
                    <Link to={section.location} key={section.location}>
                        <div
                            className={`p-2 text-xs border border-gray-300 rounded-md font-medium hover:-translate-y-0.5 hover:bg-blue-600 transition-all duration-300 relative ${current === section.location ? "bg-blue-500 text-white" : ""}`}
                        >
                            {section.location}
                            {section.location === "notifications" &&
                                newNotifications > 0 && (
                                    <div className="absolute left-22 bottom-7 text-white text-xs bg-red-500 aspect-square size-4 flex justify-center items-center rounded-full">
                                        {newNotifications}
                                    </div>
                                )}

                            {section.location === "messages" &&
                                isNewMessage && (
                                    <div className="absolute left-20 bottom-7 text-xs bg-red-500 aspect-square size-2 rounded-full"></div>
                                )}
                        </div>
                    </Link>
                ))}
            </div>

            <button
                onClick={onLogout}
                className="bg-white text-black !text-xs !text-left border border-gray-300 !p-2 w-full hover:-translate-y-0.5 hover:bg-red-600 transition-all duration-300 relative"
            >
                logout
            </button>
        </div>
    );
}
