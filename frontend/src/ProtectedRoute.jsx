import { useUser } from "./context/UserProvider";
import { Outlet } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute() {
    const { user } = useUser();

    if (user) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" replace />;
    }
}
