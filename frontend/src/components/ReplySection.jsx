import CreateComment from "./AddReply";
import CommentCard from "./CommentCard";

export default function ReplySection({
    author,
    replies,
    onReply,
    rootId,
    onLike,
}) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {replies.length > 0 && (
                <div className="">
                    {replies.map((reply) => (
                        <CommentCard
                            key={reply.id}
                            comment={reply}
                            rootId={rootId}
                            onLike={onLike}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
