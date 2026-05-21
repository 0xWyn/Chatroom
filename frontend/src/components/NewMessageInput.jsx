import { useRef, useState } from "react";
import Photo from "../assets/photo";

export default function MessageInput({
    onSubmit,
    setFile,
    fileInputRef,
    text,
    setText,
    setMediaFile,
}) {
    return (
        <form onSubmit={onSubmit} className="flex w-full justify-center gap-2">
            <label
                htmlFor="media"
                className="cursor-pointer flex items-center justify-center bg-blue-800 size-10 aspect-square rounded-md text-white"
            >
                <Photo />
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    id="media"
                    accept="image/*,video/*"
                    onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        setFile({
                            file,
                            url: URL.createObjectURL(file),
                            type: file.type.startsWith("image")
                                ? "image"
                                : "video",
                        });

                        e.target.value = "";
                    }}
                />
            </label>

            <label htmlFor="text-input" className="w-full">
                <input
                    type="text"
                    id="text-input"
                    className="border border-gray-400 p-2 w-full rounded-md bg-white focus:outline-blue-800"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </label>

            <button className="bg-blue-800 text-white text-sm">Send</button>
        </form>
    );
}
