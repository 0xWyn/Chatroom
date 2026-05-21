import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserProvider";
import API from "../services/axiosInterceptor";
import AddReply from "./AddReply";
import MoreButton from "./MoreButton";
import PostAuthor from "./PostAuthor";
import PostOptions from "./PostOptions";
import ProfilePicture from "./ProfilePicture";

export default function CommentCard({
    comment,
    onDelete,
    onLike,
    rootId,
    onReplyClick,
    isMain,
    onReply,
    onComment,
}) {
    const { comment: text, author, likes, id, replyCount } = comment;
    const [isFollowing, setIsFollowing] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const { user } = useUser();
    const [isLiked, setIsLiked] = useState(likes.includes(user.id.toString()));
    const [likeCount, setLikeCount] = useState(likes.length);
    const [fullAuthor, setFullAuthor] = useState(author.username);

    useEffect(() => {
        setLikeCount(likes.length);
        setIsLiked(likes.includes(user.id.toString()));
    }, [comment]);

    const handleFriend = async () => {
        console.log(abc);
    };

    const handleLike = async () => {
        try {
            await API.patch(`comments/${id}/likes/${user.id}`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async () => {
        await onDelete(id);
    };

    const displayOptions = () => {
        setShowOptions((showOptions) => !showOptions);
    };

    const fetchIsFollowing = async () => {
        try {
            const res = await API.get(`users/${user.id}/friends/${author.id}`);
            console.log(res.data);
            setIsFollowing(res.data.isFollowing);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
            const response = await API.get(`users/${author.id}`);
            const friends = response.data.friends;
            const isFollowing = friends.includes(`${user.id}`);

            setIsFollowing(isFollowing);
            setFullAuthor(response.data);
        };

        fetchUser();
    }, []);

    const handleReply = async (reply) => {
        try {
            const payload = {
                ...reply,
                author: { id: user.id, username: user.username },
            };
            const response = await API.post(
                `comments/${rootId}/replies`,
                payload
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="w-full relative px-4 py-2 rounded-md shadow-sm my-1 bg-white border border-gray-200">
            {showOptions && (
                <div className={`absolute right-10 top-1 z-10`}>
                    <PostOptions
                        onDelete={handleDelete}
                        isAuthor={comment.author.id === user.id}
                        isFollowing={isFollowing}
                    />
                </div>
            )}
            {/* Profile Pic, Name and Delete Button */}
            <div className="flex gap-2">
                <div className="border overflow-hidden rounded-full flex items-center justify-center shrink-0 size-10">
                    <ProfilePicture size={10} user={fullAuthor} />
                </div>

                <div className="flex flex-col items-start w-full">
                    <div className="flex w-full justify-between">
                        <PostAuthor author={author} />
                        <MoreButton size={5} onClick={displayOptions} />
                    </div>

                    {/* Text */}
                    <div className="flex items-end gap-1">
                        {comment.replyTo && (
                            <p className="text-xs text-gray-400">
                                @{comment.replyTo}
                            </p>
                        )}

                        <p className="text-sm py-0">{text}</p>
                    </div>

                    {/* Engagement */}
                    <div className="w-full flex justify-between items-center">
                        <div className="flex gap-10">
                            {/* Likes */}
                            <div className="flex items-center justify-center bg-white rounded-full gap-1">
                                <button
                                    className={`${isLiked ? "text-red-500" : ""} cursor-pointer transition-colors !p-0 !m-0`}
                                    onClick={handleLike}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill={`${isLiked ? "red" : "none"}`}
                                        viewBox="0 0 24 24"
                                        strokeWidth={1}
                                        stroke="currentColor"
                                        className="size-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                        />
                                    </svg>
                                </button>
                                <span className="text-xs">{likeCount}</span>
                            </div>
                            {/* Replies */}

                            <div className="flex items-center justify-center bg-white rounded-full gap-1">
                                <button
                                    className="cursor-pointer !p-0 !m-0"
                                    onClick={() => {
                                        setShowReplies((prev) => !prev);

                                        if (isMain) onReplyClick();
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1}
                                        stroke="currentColor"
                                        className="size-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                        />
                                    </svg>
                                </button>
                                {isMain && (
                                    <span className="text-xs">
                                        {replyCount}
                                    </span>
                                )}
                            </div>

                            {/* Undecided */}
                            <div className="bg-white size-5 rounded-full"></div>
                        </div>

                        <div>
                            <div className="bg-white size-5 rounded-full"></div>
                        </div>
                    </div>

                    {showReplies && (
                        <div className="my-1 w-full">
                            <AddReply
                                replyTo={author.username}
                                onComment={handleReply}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
