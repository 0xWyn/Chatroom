import { useUser } from "../context/UserProvider";
import API from "../services/axiosInterceptor";
import Postcard from "./Postcard";

export default function PostContainer({ onDelete }) {
    const { feedPostIds, postsById } = useUser();

    return (
        <div className="h-full w-full flex flex-col gap-2 rounded-md">
            <div className="w-full flex flex-col items-center gap-2">
                {feedPostIds.length ? (
                    feedPostIds.map((id) => (
                        <Postcard
                            key={id}
                            post={postsById[id]}
                            onDelete={onDelete}
                        />
                    ))
                ) : (
                    <p className="flex w-full h-full items-center justify-center text-gray-500">
                        No posts yet
                    </p>
                )}
            </div>
        </div>
    );
}
