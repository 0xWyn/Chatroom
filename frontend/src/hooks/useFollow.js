import { useState } from "react";
import API from "../services/axiosInterceptor";

export function useFollow(targetId, userId) {
    const [followers, setFollowers] = useState(false);

    const toggleFollow = async () => {
        const { data } = await API.patch(`users/${targetId}/follow/${userId}`);
        setFollowers(data.followers);
    };

    return { followers, toggleFollow };
}
