import { useState } from "react";

export default function CreateComment({ onComment, replyTo }) {
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            return;
        }
        const reply = {
            comment,
            replyTo: replyTo,
        };

        onComment(reply);
        setComment("");
    };

    return (
        <div className="w-full">
            <p className="text-xs text-gray-500 font-medium">
                Reply to: @{replyTo}
            </p>
            <form
                onSubmit={handleSubmit}
                className="flex w-full justify-center gap-2"
            >
                <label htmlFor="new-comment" className="w-full">
                    <input
                        type="text"
                        id="new-comment"
                        className="border border-gray-400 px-2 py-1 w-full rounded-md bg-white focus:outline-slate-800 text-sm"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </label>
                <button className="bg-slate-800 text-white text-xs !font-normal">
                    Reply
                </button>
            </form>
        </div>
    );
}
