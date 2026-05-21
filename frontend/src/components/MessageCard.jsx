import { useEffect, useState } from "react";
import ProfilePicture from "./ProfilePicture";
import MoreButton from "./MoreButton";

export default function MessageCard({ message, currentUser, onDelete }) {
    const [fileType, setFileType] = useState(null);
    const [media, setMedia] = useState(null);
    const [showOptions, setShowOptions] = useState(false);

    const text = message.text;

    useEffect(() => {
        if (!message.media?.fileName) {
            return;
        }
        setMedia(`http://localhost:3001/uploads/${message.media.fileName}`);
        setFileType(
            message.media.mimeType.startsWith("image") ? "image" : "video"
        );
    }, [message]);

    const onOptions = () => {
        setShowOptions((prev) => !prev);
    };
    const isCurrentUser = message.sender.id === currentUser.id;
    return (
        <div
            className={`flex ${isCurrentUser ? "justify-end" : "justify-end flex-row-reverse"} items-start gap-2 relative`}
        >
            {showOptions && (
                <div className="absolute z-10 top-8 right-14 bg-white text-xs rounded-md shadow-md p-2">
                    <button
                        className="border bg-black text-white hover:text-red-600"
                        onClick={onDelete}
                    >
                        Delete message
                    </button>
                </div>
            )}
            <div
                className={`flex flex-col gap-1 relative rounded-2xl overflow-hidden ${isCurrentUser ? "bg-blue-500 text-white" : "bg-white"}`}
            >
                {isCurrentUser && (
                    <div className="absolute right-0 z-10 top-2">
                        <MoreButton size={6} color="blue" onClick={onOptions} />
                    </div>
                )}
                {text && (
                    <div className={`text-sm rounded-md p-3 shadow-md pr-5`}>
                        {text}
                    </div>
                )}
                {media && (
                    <div className="rounded-md overflow-hidden w-70">
                        {fileType === "image" && (
                            <img src={media} alt="picture" />
                        )}
                        {fileType === "video" && (
                            <video
                                src={media}
                                alt="video"
                                controls
                                autoPlay={false}
                            />
                        )}
                    </div>
                )}
            </div>
            <div className="border-2 rounded-full">
                <ProfilePicture user={message.sender} size={10} />
            </div>
        </div>
    );
}
