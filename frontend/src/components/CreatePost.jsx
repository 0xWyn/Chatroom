import { useEffect, useMemo, useState } from "react";
import ProfilePicture from "./ProfilePicture";
import { useUser } from "../context/UserProvider";
import Photo from "../assets/photo";
import XMark from "../assets/x-mark";
import { Link } from "react-router-dom";

export default function CreatePost({ onSubmit }) {
    const [text, setText] = useState("");
    const [images, setImages] = useState([]);
    const [video, setVideo] = useState(null);
    const [selected, setSelected] = useState(null);
    const { user } = useUser();

    const previews = useMemo(() => {
        const imagePreviews = images.map((file) => ({
            type: "image",
            file,
            url: URL.createObjectURL(file),
        }));

        const videoPreview = video
            ? [
                  {
                      type: "video",
                      file: video,
                      url: URL.createObjectURL(video),
                  },
              ]
            : [];

        return [...imagePreviews, ...videoPreview];
    }, [images, video]);

    useEffect(() => {
        return () => {
            previews.forEach((p) => URL.revokeObjectURL(p.url));
        };
    }, [previews]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim() && !images.length && !video) {
            return;
        }

        const post = {
            text: text,
            media: {
                images: images,
                video: video,
            },
        };

        setText("");
        setImages([]);
        setVideo(null);

        console.log(post);
        onSubmit(post);
    };

    const resize = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className="w-full bg-white p-4 px-10 rounded-md flex flex-col gap-2 shadow-sm">
            <div className="flex items-start gap-4 mt-4">
                <ProfilePicture size={12} user={user} />

                <form onSubmit={handleSubmit} className="flex flex-col w-full">
                    <label htmlFor="text" className="">
                        <textarea
                            name="text"
                            id="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={1}
                            placeholder="What's on your mind?"
                            className="resize-none rounded-md outline-2 outline-gray-300 w-full p-2 focus:outline-blue-600 max-h-50 text-sm"
                            onInput={resize}
                        />
                    </label>

                    <div className="flex w-full justify-between">
                        <label
                            htmlFor="media"
                            className="bg-blue-500 !p-2 rounded-lg text-white cursor-pointer active:bg-blue-600 hover:bg-blue-300"
                        >
                            <Photo />
                            <input
                                type="file"
                                id="media"
                                name="media"
                                accept="image/*,video/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;

                                    if (file.type.startsWith("image")) {
                                        if (images.length >= 4) {
                                            alert(
                                                "You can only upload up to 4 images."
                                            );
                                            e.target.value = "";
                                            return;
                                        }
                                        setImages((images) => [
                                            ...images,
                                            file,
                                        ]);
                                    } else if (file.type.startsWith("video")) {
                                        setVideo(file);
                                    }

                                    e.target.value = "";
                                    return;
                                }}
                                className="hidden"
                            />
                        </label>
                        <button
                            disabled={!text.trim() && !images.length && !video}
                            className="bg-blue-500 disabled:opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed text-white text-xs !font-medium active:bg-blue-600 hover:bg-blue-300 transition-colors duration-300"
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
            {previews && (
                <div className="flex flex-wrap gap-2 w-full max-h-80 overflow-x-auto pl-16">
                    {previews.map((p) => (
                        <div
                            key={p.url}
                            className="h-40 relative aspect-square shrink-0 rounded-sm overflow-hidden"
                        >
                            {p.type === "image" ? (
                                <Link to={p.url} target="_blank">
                                    <img
                                        src={p.url}
                                        alt={`${p.type} preview`}
                                        className="rounded-md w-full h-full object-cover"
                                    />
                                </Link>
                            ) : (
                                <video
                                    src={p.url}
                                    controls
                                    alt={`${p.type} preview`}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            <button
                                type="button"
                                className="absolute top-1 right-1 !p-2 !m-0 bg-blue-500 hover:text-red-700"
                                onClick={() => {
                                    if (p.type === "image") {
                                        setImages((prev) =>
                                            prev.filter(
                                                (image) => image !== p.file
                                            )
                                        );
                                    } else {
                                        setVideo(null);
                                    }
                                }}
                            >
                                <XMark />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
