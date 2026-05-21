import ProfilePicture from "./ProfilePicture";

export default function ChatHeader({ user }) {
    if (!user) return null;

    return (
        <div className="flex gap-2 items-center mb-2">
            <ProfilePicture user={user} />
            <p className="font-medium text-l">{user.username}</p>
        </div>
    );
}
