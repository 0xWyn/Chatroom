import { Link } from "react-router-dom";
import { useUser } from "../context/UserProvider";
const sizes = {
    8: "size-8",
    10: "size-10",
    12: "size-12",
    14: "size-14",
    16: "size-16",
    18: "size-18",
    20: "size-20",
    22: "size-22",
    24: "size-24",
    26: "size-26",
    28: "size-28",
    30: "size-30",
};
export default function ProfilePicture({ size = 12, user }) {
    const { user: currentUser } = useUser();
    const avatarUrl = user?.avatar
        ? `http://localhost:3001${user.avatar}`
        : null;

    return (
        <div
            className={`${sizes[size]} overflow-hidden rounded-full flex items-center justify-center shrink-0 pointer-events-auto`}
        >
            <Link
                to={
                    user.id === currentUser.id
                        ? "/profile"
                        : `/users/${user.id}`
                }
            >
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-full h-full object-center"
                    />
                ) : (
                    <p className="text-gray-500 text-lg font-bold">
                        {user?.username?.charAt(0).toUpperCase() || "?"}
                    </p>
                )}
            </Link>
        </div>
    );
}
