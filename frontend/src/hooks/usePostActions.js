import API from "../services/axiosInterceptor";

export function usePostActions({ post, user, onLike, refreshUser }) {
    const handleLike = async (isLiked, setIsLiked) => {
        try {
            const url = `posts/${post.id}/likes/${user.id}`;
            isLiked ? await API.delete(url) : await API.post(url);

            setIsLiked((p) => !p);
            onLike();
        } catch (error) {
            console.error(error);
        }
    };

    const handleFriend = async (isFollowing, setIsFollowing) => {
        try {
            const url = `users/${post.author.id}/follow`;
        } catch (error) {}
    };
}
