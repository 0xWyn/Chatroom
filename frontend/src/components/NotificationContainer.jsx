import NotificationCard from "./NotificationCard";
import { useUser } from "../context/UserProvider";
import API from "../services/axiosInterceptor";

export default function NotificationContainer() {
    const { notifications, setNotifications, user } = useUser();

    const handleRead = async (id) => {
        try {
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, read: true } : n))
            );
            await API.patch(`notifications/${id}/read`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            // setNotifications((prev) => prev.filter((n) => n.id !== id));
            console.log(id);
            const { data } = await API.delete(`notifications/${id}`);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const { read, unread } = (notifications || []).reduce(
        (acc, n) => {
            acc[n.read ? "read" : "unread"].push(n);
            return acc;
        },
        { read: [], unread: [] }
    );

    const renderNotifications = (list) =>
        list.map((notification) => (
            <NotificationCard
                notification={notification}
                key={notification.id}
                onRead={() => handleRead(notification.id)}
                onDelete={() => handleDelete(notification.id)}
            />
        ));
    return (
        <div className="w-full h-full flex justify-center bg-slate-100 rounded-md p-2">
            <div className="w-full h-full max-w-2xl bg-white p-2 rounded-md">
                <div className="p-2 flex flex-col gap-2">
                    <h2>Unread Notifications</h2>
                    {unread.length === 0 && (
                        <p className="text-sm text-gray-400">
                            No new notifications
                        </p>
                    )}
                    {renderNotifications(unread)}
                </div>

                <div className="p-2 flex flex-col">
                    <h2>Read Notifications</h2>
                    {renderNotifications(read)}
                </div>
            </div>
        </div>
    );
}
