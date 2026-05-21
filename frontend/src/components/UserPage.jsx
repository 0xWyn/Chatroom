import { useParams } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import ProfilePage from "./ProfilePage";
import API from "../services/axiosInterceptor";
import { useEffect, useState } from "react";

export default function UserPage({ type, onDelete }) {
    const { user: currentUser } = useUser();
    const [person, setPerson] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        if (type === "me") {
            setPerson(currentUser);
            return;
        }

        const fetchUser = async () => {
            const response = await API.get(`users/${id}`);
            setPerson(response.data);
        };

        fetchUser();
    }, [type, id, currentUser]);

    if (!person) return <div>Loading...</div>;
    return (
        <div className="w-full h-full">
            <ProfilePage person={person} onDelete={onDelete} />
        </div>
    );
}
