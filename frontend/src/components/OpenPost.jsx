import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowLeft from "../assets/arrow-left";
import { useUser } from "../context/UserProvider";
import API from "../services/axiosInterceptor";
import CommentContainer from "./CommentContainer";
import Postcard from "./Postcard";

export default function OpenPost({ onDelete }) {
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const { id } = useParams();
    const { postsById, socket } = useUser();
    const [comments, setComments] = useState([]);
    const [commentIds, setCommentIds] = useState([]);
    const [commentsById, setCommentsById] = useState({});

    useEffect(() => {
        setPost(postsById[id]);
    }, [id, postsById]);

    useEffect(() => {
        const fetchComments = async () => {
            const { data } = await API.get(`posts/${id}/comments`);

            setCommentIds((prev) => {
                const map = data.map((comment) => comment.id);
                return map;
            });

            setCommentsById((prev) => {
                const map = { ...prev };
                data.forEach((comment) => (map[comment.id] = comment));
                return map;
            });
        };

        fetchComments();
    }, [postsById]);

    useEffect(() => {
        if (!(commentIds.length || Object.values(commentsById).length)) return;

        const commentsMap = commentIds.map((id) => commentsById[id]);
        setComments(commentsMap);
    }, [commentIds, commentsById]);

    const handleDeletePost = async () => {
        await API.delete(`posts/${id}`);
        navigate("/");
    };

    const handleNewComment = async (comment) => {
        try {
            await API.post(`posts/${id}/comments`, comment);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    useEffect(() => {
        if (!socket) return;
        const handleUpdatedComment = (comment) => {
            console.log("Hit handleUpdatedComment");
            if (comment.parentPostId !== id) return;
            setCommentsById((prev) => ({ ...prev, [comment.id]: comment }));
        };

        socket.on("updated_comment", handleUpdatedComment);
        return () => {
            socket.off("updated_comment", handleUpdatedComment);
        };
    }, [socket]);

    if (!post) {
        return <div>Loading...</div>;
    }
    return (
        <div className="h-full w-full bg-slate-100 rounded-md flex flex-col items-center overflow-auto">
            <div className="w-full max-h-10 h-10 bg-white border-bottom flex grow-0 items-center gap-4 p-4">
                <button
                    className="text-black !p-0 !rounded-full aspect-square size-8 flex items-center justify-center hover:bg-gray-200"
                    onClick={() => navigate("..")}
                >
                    <ArrowLeft />
                </button>
                <p className="text-lg font-bold text-gray-800">Post</p>
            </div>
            <div className="w-full max-w-2xl h-full flex flex-col gap-2 items-center p-2">
                {post && (
                    <>
                        <Postcard
                            post={post}
                            onDelete={handleDeletePost}
                            replyCount={comments.length}
                        />
                        <div className="h-full bg-white shadow-md rounded-md w-full">
                            <CommentContainer
                                comments={comments}
                                onAddComment={handleNewComment}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
