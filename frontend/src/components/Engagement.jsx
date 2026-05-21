import { Link } from "react-router-dom";

export default function EngagementButtons({
    handleLike,
    isLiked,
    likes,
    replyCount,
    post,
}) {
    return (
        <div className="h-10 flex justify-between items-center pointer-events-auto">
            <div className="flex gap-15">
                {/* Likes */}
                <div className="flex items-center justify-center bg-white rounded-full gap-1">
                    <button
                        className={`${isLiked ? "" : ""} cursor-pointer transition-colors !p-0 !m-0`}
                        onClick={handleLike}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={`${isLiked ? "red" : "none"}`}
                            viewBox="0 0 24 24"
                            strokeWidth={1}
                            stroke={`${isLiked ? "" : "currentColor"}`}
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                            />
                        </svg>
                    </button>
                    <span className="text-sm text-gray-600">
                        {likes.length}
                    </span>
                </div>

                {/* Comments */}
                <Link to={`/posts/${post.id}`}>
                    <div className="flex items-center justify-center bg-white rounded-full gap-1">
                        <button
                            className={`cursor-pointer transition-colors !p-0 !m-0`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1}
                                stroke="currentColor"
                                className="size-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                />
                            </svg>{" "}
                        </button>
                        <span className="text-sm text-gray-600">
                            {replyCount ? replyCount : 0}
                        </span>
                    </div>
                </Link>

                <div className="bg-white size-5 rounded-full border"></div>
            </div>
            <div>
                <div className="bg-white size-5 rounded-full border"></div>
            </div>
        </div>
    );
}
