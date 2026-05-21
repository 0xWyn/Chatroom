import LoginForm from "./components/LoginForm.jsx";
import { UserProvider, useUser } from "./context/UserProvider.jsx";
import { Routes, Route, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { lazy, Suspense } from "react";
import API from "./services/axiosInterceptor.js";
import { FetchService, DeleteService } from "./services/ApiService.js";
import { ToastContainer } from "react-toastify";

const MessageInterface = lazy(
    () => import("./components/MessageInterface.jsx")
);
const ChatPage = lazy(() => import("./components/ChatPage.jsx"));
const CreateAccount = lazy(() => import("./components/CreateAccount.jsx"));
const Application = lazy(() => import("./components/Application.jsx"));
const Feed = lazy(() => import("./components/Feed.jsx"));
const Post = lazy(() => import("./components/OpenPost.jsx"));
const Notifications = lazy(() => import("./components/NotificationPage.jsx"));
const SearchPage = lazy(() => import("./components/SearchContainer.jsx"));
const ProfilePage = lazy(() => import("./components/ProfilePage.jsx"));
const UserPage = lazy(() => import("./components/UserPage.jsx"));
const Settings = lazy(() => import("./components/Settings.jsx"));
const ProfileSettings = lazy(() => import("./components/ProfileSettings.jsx"));
const AccountSettings = lazy(() => import("./components/AccountSettings.jsx"));
const NotificationSettings = lazy(
    () => import("./components/NotificationSettings.jsx")
);
const ChatList = lazy(() => import("./components/ChatList.jsx"));
const ConnectionsPage = lazy(() => import("./components/ConnectionsPage.jsx"));

function AppContent() {
    const navigate = useNavigate();
    const { user, setUser, posts, setPosts } = useUser();

    const handleLogin = async (credentials) => {
        try {
            const response = await API.post("login", credentials);
            const logger = response.data;

            if (!logger) {
                return alert("Invalid credentials. Please try again");
            }
            setUser(logger);
            localStorage.setItem("user", JSON.stringify(logger));
            navigate("/");
        } catch (error) {
            if (error.status === 400) {
                return alert("Invalid credentials");
            }
            console.error(error.response.data);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const handleCreateAccount = async (payload) => {
        try {
            const response = await API.post("register", payload);
            const user = response.data;
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            return response.status;
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Failed to create account");
            setUser(null);
        }
    };

    const refreshUser = async () => {
        try {
            const response = await API.get(`users/${user.id}`);
            const updatedUser = response.data;

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (form) => {
        try {
            const response = await API.patch(`users/${user.id}`, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            refreshUser();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteReplies = async () => {
        try {
            const response = await API.delete(`users/${user.id}/replies`);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ToastContainer />
            <Routes>
                <Route
                    path="/register"
                    element={<CreateAccount onSubmit={handleCreateAccount} />}
                />
                <Route
                    path="/login"
                    element={<LoginForm onSubmit={handleLogin} />}
                />
                <Route element={<ProtectedRoute />}>
                    <Route
                        path="/"
                        element={<Application onLogout={handleLogout} />}
                    >
                        <Route index element={<Feed />} />
                        <Route path="messages" element={<MessageInterface />}>
                            <Route index element={<ChatList />} />
                            <Route path=":id" element={<ChatPage />} />
                        </Route>

                        <Route path="home" element={<Feed />} />
                        <Route path="posts/:id" element={<Post />} />
                        <Route
                            path="notifications"
                            element={<Notifications />}
                        />
                        <Route path="search" element={<SearchPage />} />
                        <Route
                            path="profile"
                            element={<UserPage type="me" />}
                        />
                        <Route
                            path="users/:id"
                            element={<UserPage type="user" />}
                        />

                        <Route
                            path="users/:id/followers"
                            element={<ConnectionsPage type="followers" />}
                        />
                        <Route
                            path="users/:id/following"
                            element={<ConnectionsPage type="following" />}
                        />
                        <Route path="settings" element={<Settings />}>
                            <Route
                                index
                                element={
                                    <ProfileSettings onEdit={handleUpdate} />
                                }
                            />
                            <Route
                                path="profile"
                                element={
                                    <ProfileSettings onEdit={handleUpdate} />
                                }
                            />
                            <Route
                                path="account"
                                element={
                                    <AccountSettings
                                        onDeleteReplies={handleDeleteReplies}
                                    />
                                }
                            />
                            <Route
                                path="notifications"
                                element={<NotificationSettings />}
                            />
                        </Route>
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
}

export default function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}
