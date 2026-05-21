import PostContainer from "./PostContainer.jsx";
import CreatePost from "./CreatePost.jsx";
import { useUser } from "../context/UserProvider.jsx";
import API from "../services/axiosInterceptor.js";
import { useEffect } from "react";

export default function Feed() {
    const { user, socket } = useUser();

    useEffect(() => {
        if (!socket) return;

        const reconnect = () => socket.emit("join", user.id);

        socket.on("connect", reconnect);

        return () => socket.off("connect", reconnect);
    }, [socket]);

    const makePost = async (post) => {
        try {
            const formData = new FormData();
            formData.append("text", post.text);
            formData.append(
                "author",
                JSON.stringify({
                    id: user.id,
                    name: user.name,
                    username: user.username,
                    avatar: user.avatar,
                })
            );
            if (post.media) {
                if (post.media.images.length) {
                    post.media.images.forEach((image) => {
                        formData.append("images", image);
                    });
                }
                if (post.media.video) {
                    formData.append("videos", post.media.video);
                }
            }

            await API.post("posts", formData);
        } catch (error) {
            console.error(error);
            console.log("Failed to HandleNewPost: Feed.jsx");
        }
    };

    const deletePost = async (postId) => {
        try {
            await API.delete(`posts/${postId}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="h-full w-full flex justify-center rounded-md p-2 bg-slate-100 overflow-y-auto">
            <div className="h-full w-full max-w-2xl rounded-md flex flex-col items-center gap-4 ">
                <CreatePost onSubmit={makePost} />
                <PostContainer onDelete={deletePost} />
            </div>
        </div>
    );
}
