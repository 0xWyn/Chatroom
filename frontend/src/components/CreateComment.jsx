import { useState } from "react";
import { useParams } from "react-router-dom";
import AuthorComponent from "./AuthorComponent";

export default function CreateComment({ onComment }) {
    const [comment, setComment] = useState("");

    const author = AuthorComponent();
    const payload = {
        comment: comment,
        author: author,
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            return;
        }
        onComment(payload);
        setComment("");
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit}
                className="flex w-full justify-center gap-2"
            >
                <label htmlFor="new-comment" className="w-full">
                    <input
                        type="text"
                        id="new-comment"
                        className="border border-gray-400 p-2 w-full rounded-md bg-white focus:outline-blue-800"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                </label>
                <button className="bg-slate-800 text-white text-sm !font-normal">
                    Post
                </button>
            </form>
        </div>
    );
}
