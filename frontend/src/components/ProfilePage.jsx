import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ArrowLeft from "../assets/arrow-left";
import Envelope from "../assets/envelope";
import { useUser } from "../context/UserProvider";
import API from "../services/axiosInterceptor";
import FollowButtonIcons from "./FollowButtonIcons";
import Postcard from "./Postcard";
import ProfilePicture from "./ProfilePicture";

export default function ProfilePage({ person, onDelete }) {
    const [postIds, setPostIds] = useState([]);
    const [postsById, setPostsById] = useState({});
    const { user: currentUser, socket } = useUser();
    const [isFollowing, setIsFollowing] = useState(
        person.followers.includes(currentUser.id.toString())
    );
    const [followers, setFollowers] = useState(person.followers?.length || 0);
    const [following, setFollowing] = useState(person.following?.length || 0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!person) return;
        const fetchPosts = async () => {
            const { data } = await API.get(`users/${person.id}/posts`);
            setPostIds((prev) => {
                const map = data.map((p) => p.id);
                return [...new Set([...prev, ...map])];
            });
            setPostsById((prev) => {
                const map = { ...prev };
                data.forEach((post) => (map[post.id] = post));
                return map;
            });
        };

        fetchPosts();
    }, [person]);

    useEffect(() => {
        if (!socket) return;

        const handlePostUpdate = (post) => {
            if (!postIds.includes(post.id)) return;
            setPostsById((prev) => ({ ...prev, [post.id]: post }));
        };

        const handleNewPost = (post) => {
            if (post.author.id !== person.id) return;
            setPostIds((prev) => [post.id, ...prev]);
            setPostsById((prev) => ({ [post.id]: post, ...prev }));
        };

        const handleDeletedPost = (post) => {
            if (!postIds.includes(post.id)) return;
            setPostIds((prev) => prev.filter((id) => id !== post.id));
            setPostsById((prev) => {
                const copy = { ...prev };
                delete copy[post.id];
                return copy;
            });
        };

        socket.on("liked_post", handlePostUpdate);
        socket.on("unliked_post", handlePostUpdate);
        socket.on("new_post", handleNewPost);
        socket.on("deleted_post", handleDeletedPost);
        socket.on("updated_post", handlePostUpdate);
        return () => {
            socket.off("liked_post", handlePostUpdate);
            socket.off("unliked_post", handlePostUpdate);
            socket.off("new_post", handleNewPost);
            socket.off("deleted_post", handleDeletedPost);
            socket.off("updated_post", handlePostUpdate);
        };
    }, [socket, postIds]);

    useEffect(() => {
        if (!socket) return;

        const handleFollowUpdate = (updates) => {
            const relevant =
                Object.values(updates).find((user) => user.id === person.id) ??
                null;
            if (!relevant) return;

            console.log("Hitting handleFollowUpdate");
            setFollowing(relevant.following.length);
            setFollowers(relevant.followers.length);
            setIsFollowing(relevant.followers.includes(currentUser.id));
        };

        socket.on("follow_update", handleFollowUpdate);

        return () => {
            socket.off("follow_update", handleFollowUpdate);
        };
    }, [socket, person.id, currentUser.id]);

    const avatarUrl = person?.avatar
        ? `http://localhost:3001${person.avatar}`
        : null;

    const coverUrl = person?.cover
        ? `http://localhost:3001${person.cover}`
        : null;

    const handleToggleFollow = async () => {
        try {
            await API.patch(`users/${person.id}/follow/${currentUser.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-slate-100 rounded-md">
            <div className="w-full max-w-2xl max-h-10 h-10 bg-white/20 flex grow-0 items-center gap-4 p-4">
                <button
                    className="text-black !p-0 !rounded-full aspect-square size-8 flex items-center justify-center hover:bg-gray-200"
                    onClick={() => navigate("..")}
                >
                    <ArrowLeft />
                </button>
                <p className="text-lg font-bold text-gray-800">
                    {person.username}
                </p>
            </div>
            <div className="relative min-h-0 rounded-md w-full max-w-2xl flex flex-col gap-4">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-xs">
                    {/* Cover Image */}
                    <div className="relative w-full aspect-[3/1] rounded-b-2xl bg-slate-600 border-slate-200">
                        {person?.cover ? (
                            <img
                                src={coverUrl}
                                alt="Cover image"
                                className="w-full h-full object-fit rounded-b-2xl"
                            />
                        ) : (
                            <div className="flex w-full h-full justify-center items-center">
                                <p className="font-bold text-lg text-gray-400">
                                    NO COVER IMAGE
                                </p>
                            </div>
                        )}

                        {/* Top Bar */}
                        <div className="flex absolute top-0 left-0 w-full justify-between items-center p-3">
                            {person.id === currentUser.id && (
                                <Link to="/settings/profile">
                                    <button className="bg-blue-500 text-xs font-medium text-white hover:bg-violet-500 active:bg-violet-600">
                                        EDIT
                                    </button>
                                </Link>
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="absolute top-full -translate-y-1/2 left-4 rounded-full border-4 border-white">
                            <ProfilePicture size={24} user={person} />
                        </div>
                    </div>

                    {/* Info */}
                    <div className="mt-14 px-5 flex items-start gap-2 justify-between">
                        <div className="w-full flex flex-col items-start">
                            <div className="w-full flex justify-between">
                                <p className="text-lg font-bold">
                                    {person.name}
                                </p>
                                {person.id !== currentUser.id && (
                                    <div className="flex gap-3">
                                        <button
                                            className="!p-0"
                                            onClick={() =>
                                                navigate(
                                                    `/messages/${person.id}`
                                                )
                                            }
                                        >
                                            <Envelope />
                                        </button>
                                        <FollowButtonIcons
                                            isFollowing={isFollowing}
                                            onFollow={handleToggleFollow}
                                        />
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-gray-600">
                                {person.bio || "No bio yet"}
                            </p>
                        </div>
                    </div>

                    <div className="px-4 flex gap-6 text-sm text-gray-600 my-2">
                        <div>
                            <span className="font-bold">{followers} </span>
                            <Link to={`/users/${person.id}/followers`}>
                                Followers
                            </Link>
                        </div>
                        <div>
                            <span className="font-bold">{following}</span>{" "}
                            <Link to={`/users/${person.id}/following`}>
                                Following
                            </Link>
                        </div>
                    </div>
                </div>

                {postIds.length > 0 && (
                    <div className="flex flex-col gap-2 px-1 py-4">
                        {postIds.map((id) => (
                            <Postcard
                                post={postsById[id]}
                                key={id}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
