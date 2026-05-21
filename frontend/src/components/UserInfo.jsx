import PostAuthor from "./PostAuthor";
import ProfilePicture from "./ProfilePicture";
import UserPlus from "../assets/userplus";
import { Link } from "react-router-dom";

export default function UserInfo({ user }) {
    return (
        <Link to={`/users/${user.id}`}>
            <div className="w-full border-y border-gray-400 flex gap-2 p-4">
                <ProfilePicture user={user} />
                <div className="flex flex-col min-w-0">
                    <div className="w-full flex gap-1 items-center">
                        <p className="shrink-0 rounded-md font-medium">
                            {user.name}
                        </p>
                        <div className="border border-gray-300 rounded-md p-1 bg-blue-400">
                            <PostAuthor author={user} />
                        </div>
                        {/* <button className="hover:bg-indigo-400 !p-1 !aspect-square grow-0 flex flex-1 self-start justify-center items-center">
                            <UserPlus size={5} />
                        </button> */}
                    </div>
                    <div className="truncate text-sm text-gray-600">
                        {user.bio}
                    </div>
                </div>
            </div>
        </Link>
    );
}
