import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Settings() {
    return (
        <div className="h-full bg-white rounded-md w-full p-2 flex gap-1">
            <div className="h-full w-80 border border-gray-300 rounded-md flex flex-col gap-10 p-4 text-2xl font-medium">
                <div>
                    <Link to={`/settings/profile`}>
                        <p>Profile</p>
                        <hr className="text-gray-400" />
                    </Link>
                </div>
                <div>
                    <Link to={`/settings/account`}>
                        <p>Account</p>
                        <hr className="text-gray-400" />
                    </Link>
                </div>
                <div>
                    <Link to={`/settings/notifications`}>
                        <p>Notifications</p>
                        <hr className="text-gray-400" />
                    </Link>
                </div>
            </div>

            <Outlet />
        </div>
    );
}
