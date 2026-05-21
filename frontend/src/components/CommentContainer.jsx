import { useEffect, useState } from "react";
import API from "../services/axiosInterceptor.js";
import CommentCard from "./CommentCard.jsx";
import CreateComment from "./CreateComment.jsx";
import { useUser } from "../context/UserProvider.jsx";

export default function CommentContainer({ comments, onAddComment }) {
    const [replies, setReplies] = useState([]);
    const [replyIds, setReplyIds] = useState([]);
    const [repliesById, setRepliesById] = useState({});
    const [activeCommentId, setActiveCommentId] = useState(null);
    const { socket } = useUser();

    useEffect(() => {
        if (activeCommentId === null) return;
        const fetchReplies = async () => {
            const { data } = await API.get(
                `comments/${activeCommentId}/replies`
            );
            setReplyIds((prev) => {
                const ids = data.map((reply) => reply.id);
                return [...new Set([...prev, ...ids])];
            });
            setRepliesById((prev) => {
                const map = { ...prev };
                data.forEach((reply) => {
                    map[reply.id] = reply;
                });
                return map;
            });
        };

        fetchReplies();
    }, [activeCommentId]);

    useEffect(() => {
        if (!activeCommentId) return;
        const repliesMap = replyIds.map((id) => repliesById[id]);
        setReplies(repliesMap);
    }, [activeCommentId, replyIds, repliesById]);

    const toggleReplies = async (commentId) => {
        if (activeCommentId === commentId) {
            setActiveCommentId(null);
            setReplies([]);
            return;
        }
        setActiveCommentId(commentId);
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await API.delete(`comments/${commentId}`);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleReplyUpdate = (reply) => {
            console.log("Hit handleReplyUpdate");
            if (reply.parentCommentId !== activeCommentId) return;
            setRepliesById((prev) => ({ ...prev, [reply.id]: reply }));
        };

        const handleNewReply = (reply) => {
            if (reply.parentCommentId !== activeCommentId) return;
            setReplyIds((prev) => [reply.id, ...prev]);
            setRepliesById((prev) => ({ [reply.id]: reply, ...prev }));
        };

        const handleDeletedReply = (reply) => {
            if (reply.parentCommentId !== activeCommentId) return;
            console.log("Hit handleDeletedReply");
            setReplyIds((prev) => prev.filter((id) => id !== reply.id));
            setRepliesById((prev) => {
                const copy = { ...prev };
                delete copy[reply.id];
                return copy;
            });
        };

        socket.on("updated_reply", handleReplyUpdate);
        socket.on("new_reply", handleNewReply);
        socket.on("deleted_reply", handleDeletedReply);

        return () => {
            socket.off("updated_reply", handleReplyUpdate);
            socket.off("new_reply", handleNewReply);
            socket.off("deleted_reply", handleDeletedReply);
        };
    }, [socket, activeCommentId]);
    return (
        <div className="w-full rounded-md flex flex-col gap-8 p-10">
            <CreateComment onComment={onAddComment} />

            <div className="w-full rounded-md">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id}>
                            <CommentCard
                                comment={comment}
                                rootId={comment.id}
                                isMain={true}
                                replyCount={replies.length}
                                onReplyClick={() => toggleReplies(comment.id)}
                                onDelete={handleDeleteComment}
                            />

                            {activeCommentId === comment.id &&
                                replies.length > 0 && (
                                    <div className="ml-12">
                                        {replies.map((reply) => (
                                            <CommentCard
                                                comment={reply}
                                                key={reply.id}
                                                rootId={comment.id}
                                                isMain={false}
                                                onComment={() =>
                                                    onReply(comment.id)
                                                }
                                                onDelete={handleDeleteComment}
                                            />
                                        ))}
                                    </div>
                                )}
                        </div>
                    ))
                ) : (
                    <div className="flex w-full h-full justify-center items-center">
                        <p className="text-gray-400">Ain't no comments</p>
                    </div>
                )}
            </div>
        </div>
    );
}
