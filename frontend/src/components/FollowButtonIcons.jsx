import UserPlus from "../assets/userplus";
import User from "../assets/user";

export default function FollowButton({ isFollowing, onFollow }) {
    return (
        <div>
            <button
                onClick={onFollow}
                className={`!text-xs !font-medium text-white !p-1 !px-2 ${isFollowing ? "bg-green-600" : "bg-black text-white"}`}
            >
                {isFollowing ? (
                    <div className="flex gap-1 items-center">
                        <User />
                        <p>Following</p>
                    </div>
                ) : (
                    <div className="flex gap-1 items-center">
                        <UserPlus />
                        <p>Follow</p>
                    </div>
                )}
            </button>
        </div>
    );
}
