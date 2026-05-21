import NotificationContainer from "./NotificationContainer";
import ArrowLeft from "../assets/arrow-left";
import { useNavigate } from "react-router-dom";

export default function NotificationPage() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col h-full bg-white rounded-md w-full p-2">
            <div className="w-full max-h-10 h-10 bg-white border-bottom flex grow-0 items-center gap-4 p-4">
                <button
                    className="text-black !p-0 !rounded-full aspect-square size-8 flex items-center justify-center hover:bg-gray-200"
                    onClick={() => navigate("..")}
                >
                    <ArrowLeft />
                </button>
                <p className="text-lg font-bold text-gray-800">Notifications</p>
            </div>
            <NotificationContainer />
        </div>
    );
}
