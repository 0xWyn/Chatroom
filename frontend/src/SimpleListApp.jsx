import { Routes, Route, Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useUser, UserProvider } from "./context/UserProvider";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function ProtectedRoute() {
    const { user } = useUser();

    if (!user) {
        return <Navigate to="/registration" replace />;
    }

    return <Outlet />;
}

function NavBar() {
    return (
        <nav className="w-full">
            <ul className="text-decoration-none flex bg-white gap-2 justify-center p-3 rounded-md border">
                <li className="text-lg font-medium border px-4 rounded-md">
                    <Link to="/list">
                        <button>List</button>
                    </Link>
                </li>
                <li className="text-lg font-medium border px-4 rounded-md">
                    <Link>
                        <button>Other List</button>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
function UsernameApp({ onLogout }) {
    const { user } = useUser();

    return (
        <div className="flex flex-col items-center w-screen border p-10 gap-10">
            <h1>Welcome, {user.name}</h1>
            <NavBar />

            <Outlet />
            <button className="border" onClick={onLogout}>
                Logout
            </button>
        </div>
    );
}

function List() {
    return (
        <div className="bg-white w-full p-5 text-lg border rounded-md">
            <ol>
                <Link to="/list/cheese">
                    <li className="border p-2">Cheese</li>
                </Link>

                <li>Milk</li>
                <li>Watermelon</li>
            </ol>

            <Outlet />
        </div>
    );
}

function Cheese() {
    return (
        <div>
            <h1>Cheese</h1>
            <p>Color: Yellow</p>
        </div>
    );
}

function Registration({ onSubmit }) {
    const [form, setForm] = useState({ name: "", password: "" });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.password.trim()) {
            return;
        }

        onSubmit(form);

        setForm({ name: "", password: "" });
    };

    return (
        <div className="flex flex-col items-center">
            <h1>Register</h1>
            <form
                onSubmit={handleSubmit}
                className="flex flex-col p-4 w-md items-center gap-4 rounded-md bg-white shadow-md m-3"
            >
                <label htmlFor="name" className="flex flex-col">
                    Name
                    <input
                        type="text"
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                            setForm((form) => ({
                                ...form,
                                name: e.target.value,
                            }))
                        }
                        className="border p-2 rounded-md border-2"
                        required
                    />
                </label>
                <label htmlFor="password" className="flex flex-col">
                    Password
                    <input
                        type="text"
                        id="password"
                        value={form.password}
                        onChange={(e) =>
                            setForm((form) => ({
                                ...form,
                                password: e.target.value,
                            }))
                        }
                        className="border p-2 rounded-md border-2"
                        required
                    />
                </label>
                <button className="border">Submit</button>
            </form>
        </div>
    );
}
function AppContent() {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleSubmit = (data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
        navigate("/registration");
    };

    return (
        <Routes>
            <Route
                path="/registration"
                element={<Registration onSubmit={handleSubmit} />}
            />

            <Route element={<ProtectedRoute />}>
                <Route
                    path="/"
                    element={<UsernameApp onLogout={handleLogout} />}
                >
                    <Route path="list" element={<List />}>
                        <Route path="cheese" element={<Cheese />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default function App() {
    return (
        <>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </>
    );
}
