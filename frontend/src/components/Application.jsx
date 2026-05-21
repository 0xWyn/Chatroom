import { Outlet } from "react-router-dom";
import NavigationBar from "./NavigationBar";

export default function App({ onLogout }) {
    return (
        <div className="h-screen w-screen max-h-screen flex items-stretch gap-2 p-2 bg-white">
            <NavigationBar onLogout={onLogout} />

            <div className="flex-1 min-h-0 w-full overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}
