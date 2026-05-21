import { Link } from "react-router-dom";
import { useUser } from "../context/UserProvider";

export default function PostAuthor({ author }) {
    const { user } = useUser();
    return (
        <div className="flex items-center gap-2 justify-between w-full pointer-events-auto">
            <div className="w-full flex items-center gap-1 justify-between">
                <div className="flex items-start gap-2">
                    <Link
                        to={
                            author.id === user.id
                                ? "/profile"
                                : `/users/${author.id}`
                        }
                        className=""
                    >
                        <p className="lowercase font-medium text-xs text-gray-800">
                            @{author.username}
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
