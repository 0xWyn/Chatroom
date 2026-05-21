import { useEffect, useRef, useState } from "react";
import MessageCard from "./MessageCard";
import { useUser } from "../context/UserProvider";
export default function MessageContainer({ thread, onDelete, setIsAtBottom }) {
    const [isNearBottom, setIsNearBottom] = useState(true);
    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const { user } = useUser();

    const handleScroll = () => {
        const container = containerRef.current;
        if (!container) return;

        const threshold = 100;
        const position =
            container.scrollHeight -
            container.scrollTop -
            container.clientHeight;

        const atBottom = position < threshold;
        setIsNearBottom(atBottom);
        setIsAtBottom(atBottom);
    };

    const scrollToBottom = () => {
        // bottomRef.current?.scrollIntoView({
        //     behavior: "smooth",
        // });

        const container = containerRef.current;
        if (!container) return;

        container.scrollTop = container.scrollHeight;
    };

    useEffect(() => {
        if (isNearBottom) {
            requestAnimationFrame(scrollToBottom);
        }
    }, [thread]);
    return (
        <div className="relative flex-1 min-h-0 mb-4">
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className={`bg-slate-200 border border-gray-300 w-full h-full rounded-lg flex flex-col gap-4 p-4 scroll-smooth relative overflow-y-auto`}
            >
                {thread.length > 0 ? (
                    thread.map((message) => (
                        <MessageCard
                            message={message}
                            currentUser={user}
                            key={message.id}
                            onDelete={() => onDelete(message)}
                        />
                    ))
                ) : (
                    <p className="flex w-full h-full items-center justify-center text-gray-400 text-center">
                        No messages yet
                    </p>
                )}
                <div ref={bottomRef} />
            </div>
            {!isNearBottom && (
                <button
                    onClick={scrollToBottom}
                    className="absolute right-4 bottom-4 bg-blue-800 text-white !px-4 !py-2 !rounded-full !shadow-lg pointer-events-auto"
                >
                    ↓
                </button>
            )}
        </div>
    );
}
