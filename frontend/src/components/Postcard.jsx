import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import API from "../services/axiosInterceptor";
import EngagementButtons from "./Engagement";
import MoreButton from "./MoreButton";
import PostAuthor from "./PostAuthor";
import PostOptions from "./PostOptions";
import ProfilePicture from "./ProfilePicture";
import { useFollow } from "../hooks/useFollow";

export default function Postcard({ post, onDelete, onAlert }) {
    if (!post) {
        return <div>Loading...</div>;
    }
    const { author, text, likes, replyCount, media } = post;
    const { user, refreshUser } = useUser();
    const [isLiked, setIsLiked] = useState(() => likes.includes(user.id));
    const [showOptions, setShowOptions] = useState(false);
    const [isFollowing, setIsFollowing] = useState();
    const [fullAuthor, setFullAuthor] = useState(author.username);
    const [count, setCount] = useState(0);
    const navigate = useNavigate();
    const { followers, toggleFollow } = useFollow(author.id, user.id);

    // Media Stuff
    const mediaUrls = useMemo(() => {
        return (
            media?.images?.map(
                (image) => `http://localhost:3001/uploads/${image}`
            ) || [media]
        );
    });

    const videoUrl = media?.videos?.[0]
        ? `http://localhost:3001/uploads/${post.media?.videos[0]}`
        : null;

    const currentMedia = mediaUrls[count];

    const handleCarouselForward = () => {
        setCount((prev) => (prev < mediaUrls.length - 1 ? prev + 1 : 0));
    };

    //

    // User stuff
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await API.get(`users/${author.id}`);

                setIsFollowing(data.friends.includes(`${user.id}`));
                setFullAuthor(data);
            } catch (error) {
                console.error(err);
            }
        };

        fetchUser();
    }, [author.id, user.id]);
    //

    // Liking stuff
    const handleLike = async () => {
        try {
            if (isLiked) {
                await API.delete(`posts/${post.id}/likes/${user.id}`);
            } else {
                await API.post(`posts/${post.id}/likes/${user.id}`);
            }

            setIsLiked((prev) => !prev);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        setIsLiked(post.likes.includes(user.id));
    }, [post.likes, user.id]);
    //

    // Following stuff

    const handleFriend = async () => {
        await toggleFollow();
        console.log(followers);
        console.log(followers.includes(user.id));
        setIsFollowing(followers.includes(user.id));
    };
    //

    // Author stuff
    const isAuthor = user.id === fullAuthor.id;
    //

    // Deleting stuff
    const handleDelete = () => {
        onDelete(post.id);
    };
    //

    return (
        <div className="w-full bg-white shadow-sm p-4 px-10 flex flex-col rounded-md relative">
            <div
                className="absolute inset-0 z-0 cursor-pointer hover:bg-slate-100 transition-colors duration-300 pointer-events-auto"
                onClick={() => navigate(`/posts/${post.id}`)}
            />
            <div className="relative z-10 flex gap-2 rounded-md p-2 pointer-events-none">
                <div className="border overflow-hidden rounded-full flex items-center justify-center shrink-0 size-10">
                    <ProfilePicture size={10} user={fullAuthor} />
                </div>
                {/* Name and Text */}
                <div className="flex flex-col items-start w-full">
                    {/* Name and Options */}
                    <div className="flex w-full justify-between items-start">
                        <PostAuthor
                            author={fullAuthor}
                            handleFriend={handleFriend}
                            isFollowing={isFollowing}
                        />
                        <div className="">
                            <MoreButton
                                size="5"
                                onClick={() => setShowOptions((p) => !p)}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <p className="text-sm">{text}</p>

                    {/* Images */}
                    {currentMedia && (
                        <div className="relative mt-2 h-[400px] w-full rounded-md overflow-hidden">
                            <img
                                src={currentMedia}
                                alt=""
                                className="absolute h-full w-full inset-0 object-cover blur-xl scale-110  opacity-80 rounded-md"
                            />
                            <div className="relative w-full h-full flex items-center justify-center">
                                {mediaUrls.length > 1 && (
                                    <button
                                        onClick={handleCarouselForward}
                                        className="absolute bottom-2 right-2 bg-black/50 text-white !px-2 !py-1 pointer-events-auto z-10"
                                    >
                                        Next
                                    </button>
                                )}
                                <Link
                                    to={currentMedia}
                                    target="_blank"
                                    className="pointer-events-auto w-full h-full flex items-center justify-center"
                                >
                                    <img
                                        src={currentMedia}
                                        alt="Post media"
                                        className="max-h-full w-full object-contain rounded-md shrink-0"
                                    />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Video */}
                    {videoUrl && (
                        <div className="relative h-100 flex w-full justify-center rounded-md bg-gray-500 my-1 pointer-events-auto overflow-hidden">
                            <video
                                src={videoUrl}
                                autoPlay
                                muted
                                loop
                                className="absolute inset-0 w-full h-full object-cover blur-xl scale-110 opacity-60"
                            />
                            <video
                                src={videoUrl}
                                controls
                                className="relative h-full max-h-full object-contain"
                            />
                        </div>
                    )}

                    {/* Engagement */}
                    <EngagementButtons
                        handleLike={handleLike}
                        isLiked={isLiked}
                        likes={likes}
                        replyCount={replyCount}
                        post={post}
                    />
                </div>
            </div>

            {showOptions && (
                <div className={` absolute right-15 top-1 z-10`}>
                    <PostOptions
                        isAuthor={isAuthor}
                        isFollowing={isFollowing}
                        onDelete={() => onDelete(post.id)}
                        handleFriend={handleFriend}
                    />
                </div>
            )}
        </div>
    );
}
