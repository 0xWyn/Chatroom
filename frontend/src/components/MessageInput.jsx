import Photo from "../assets/photo";

export default function MessageInput({
    message,
    setMessage,
    onSubmit,
    fileInputRef,
    onFileChange,
    media,
    previewUrl,
    fileType,
    setSelected,
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
                    onChange={onFileChange}
                />
            </label>

            {/* Thumbnail */}
            {media && previewUrl && (
                <div
                    className="h-10 w-10 cursor-pointer"
                    onClick={() => {
                        setSelected(media);
                    }}
                >
                    <div className="flex items-center justify-center relative max-h-full max-w-full rounded-sm overflow-hidden">
                        {fileType === "image" && (
                            <img
                                src={previewUrl}
                                alt="media"
                                className="w-full h-full object-cover"
                            />
                        )}
                        {fileType === "video" && (
                            <video
                                src={previewUrl}
                                alt="media"
                                className="w-full h-full object-fit"
                            ></video>
                        )}
                    </div>
                </div>
            )}

            <label htmlFor="new-message" className="w-full">
                <input
                    type="text"
                    id="new-message"
                    className="border border-gray-400 p-2 w-full rounded-md bg-white focus:outline-blue-800"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </label>

            <button className="bg-blue-800 text-white text-sm">Send</button>
        </form>
    );
}
