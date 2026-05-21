import UserContainer from "./ChatList";
import { Outlet, useNavigate } from "react-router-dom";
import ArrowLeft from "../assets/arrow-left";

export default function MessageInterface() {
    const navigate = useNavigate();
    return (
        <div className="w-full h-full flex flex-col gap-2 items-center bg-slate-100">
            <div className="w-full max-h-10 h-10 bg-white border-bottom flex grow-0 items-center gap-4 p-4">
                <button
                    className="text-black !p-0 !rounded-full aspect-square size-8 flex items-center justify-center hover:bg-gray-200"
                    onClick={() => navigate("..")}
                >
                    <ArrowLeft />
                </button>
                <p className="text-lg font-bold text-gray-800">Conversations</p>
            </div>
            <Outlet />
        </div>
    );
}
