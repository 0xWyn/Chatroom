import FollowButton from "./FollowButton";
export default function PostOptions({
    isAuthor,
    onDelete,
    isFollowing,
    handleFriend,
}) {
    const handleDelete = () => {
        onDelete();
    };
    return (
        <div className="flex flex-col gap-2 bg-white shadow-sm p-2 rounded-lg w-30">
            <p className="text-center text-sm">Options</p>
            {!isAuthor && (
                <FollowButton
                    handleFriend={handleFriend}
                    isFollowing={isFollowing}
                ></FollowButton>
            )}

            {isAuthor && (
                <button
                    className="bg-slate-900 text-white py-1 px-2 text-xs rounded-md hover:bg-red-600 transition-colors"
                    onClick={handleDelete}
                >
                    Delete
                </button>
            )}
        </div>
    );
}
