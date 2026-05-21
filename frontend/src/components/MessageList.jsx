export default function MessageList({
    thread,
    currentUser,
    onDelete,
    containerRef,
    bottomRef,
    onScroll,
    isNearBottom,
}) {
    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            className={`bg-slate-200 border border-gray-300 w-full rounded-lg h-full flex flex-col gap-4 p-4 scroll-smooth mb-4 relative overflow-y-auto`}
        >
            {thread.length > 0 ? (
                thread.map((message) => (
                    <MessageCard
                        message={message}
                        currentUser={user}
                        key={message.id}
                        onDelete={() => handleDelete(message.id)}
                    />
                ))
            ) : (
                <p className="flex w-full h-full items-center justify-center text-gray-400 text-center">
                    No messages yet
                </p>
            )}

            {!isNearBottom && (
                <button
                    onClick={() =>
                        bottomRef.current?.scrollIntoView({
                            behavior: "smooth",
                        })
                    }
                    className="absolute right-1 bottom-50 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg"
                >
                    ↓
                </button>
            )}
            <div ref={bottomRef} />
        </div>
    );
}
