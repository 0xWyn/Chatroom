import { useEffect, useState } from "react";
import API from "../services/axiosInterceptor";

export function useAuthor(authorId, currentUserId) {
    const [author, setAuthor] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await API.get(`users/${authorId}`);
                setAuthor(data);
                setIsFollowing(data.followers.includes(currentUserId));
            } catch (error) {
                console.error(error);
            }
        };

        fetch();
    }, [authorId, isFollowing, setIsFollowing]);

    return { author, isFollowing, setIsFollowing };
}
