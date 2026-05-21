export default function NotificationCard({ notification, onRead, onDelete }) {
    const handleRead = () => {
        onRead();
    };

    return (
        <div
            className={`h-full shadow-sm p-2 border border-gray-200 rounded-md cursor-pointer ${notification.read ? "bg-gray-300 !p-0" : "bg-white hover:bg-gray-200"} flex items-center justify-between`}
        >
            <div
                className="h-full w-full p-2 text-sm flex justify-between"
                onClick={handleRead}
            >
                <p className="">{notification.content}</p>
            </div>
        </div>
    );
}
