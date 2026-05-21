import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConnectionsList from "./ConnectionsList";
import API from "../services/axiosInterceptor";
import ArrowLeft from "../assets/arrow-left";

export default function ConnectionsPage({ type }) {
    const [request, setRequest] = useState(type);
    const [list, setList] = useState(null);
    const [user, setUser] = useState(null);
    const { id: userId } = useParams();
    const navigate = useNavigate();

    const buttons = [{ location: "following" }, { location: "followers" }];
    useEffect(() => {
        const fetchUser = async () => {
            const res = await API.get(`users/${userId}`);
            setUser(res.data);
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchList = async () => {
            const res = await API.get(`users/${userId}/${request}`);
            setList(res.data);
            console.log(res.data);
        };
        fetchList();
    }, [request, userId]);

    if (user === null || list === null) {
        return <div>Loading...</div>;
    }

    return (
        <div className="h-full w-full flex justify-center border border-gray-200">
            <div className="h-full flex flex-col items-center w-full max-w-2xl">
                <div className="w-full max-w-2xl max-h-10 h-10 bg-white/20 flex grow-0 items-center gap-4 p-4">
                    <button
                        className="text-black !p-0 !rounded-full aspect-square size-8 flex items-center justify-center hover:bg-gray-200"
                        onClick={() => navigate(`/users/${user.id}`)}
                    >
                        <ArrowLeft />
                    </button>
                    <p className="text-lg font-bold text-gray-800">
                        {user.username}
                    </p>
                </div>
                <div className="w-full flex justify-around border-b border-gray-400">
                    {buttons.map((b) => {
                        return (
                            <button
                                className={`!${request === b.location ? "font-medium" : "font-normal text-gray-500"}`}
                                onClick={() => setRequest(b.location)}
                            >
                                {b.location}
                            </button>
                        );
                    })}
                </div>
                <div className="h-full w-full">
                    {list ? (
                        <ConnectionsList list={list} />
                    ) : (
                        <div>Loading...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
