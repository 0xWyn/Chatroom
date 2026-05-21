import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import ProfilePicture from "./ProfilePicture";
import API from "../services/axiosInterceptor";
export default function ChatCard({ chat, unread }) {
    const { user, setActiveChat } = useUser();
    const { lastMessage, otherParticipant } = chat;
    const navigate = useNavigate();

    const handleSelectChat = () => {
        navigate(`${chat.id}`);
    };

    return (
        <div
            className={`${unread ? "bg-white" : "bg-gray-200"} rounded-3xl shadow-sm border-gray-500 w-full p-4 hover:bg-gray-300 transition-colors duration-300 cursor-pointer relative"`}
        >
            <div
                onClick={handleSelectChat}
                className="overflow-hidden flex items-center gap-2"
            >
                <div className="rounded-full border">
                    <ProfilePicture size={14} user={otherParticipant} />
                </div>
                <div className="flex-col gap-2 w-full">
                    <h2 className="font-medium text-sm">
                        {otherParticipant.name}
                    </h2>
                    <div className="flex w-full justify-between items-center">
                        <p className="text-gray-500 truncate text-sm">
                            <em>
                                {lastMessage.sender === user.username
                                    ? "You"
                                    : lastMessage.sender}
                            </em>
                            : {lastMessage.text || ""}
                        </p>
                        <p className="text-sm">
                            {new Date(
                                lastMessage.createdAt
                            ).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>
            {Boolean(unread) && (
                <div className="absolute size-3 rounded-full bg-red-500 right-0 top-0 z-10 flex items-center justify-center p-2">
                    <p className="text-xs font-medium text-white">
                        {unread < 9 ? unread : "+9"}
                    </p>
                </div>
            )}
        </div>
    );
}
