export default function MessageMediaThumbnail({ onClick, previewObject }) {
    console.log(previewObject);
    const isImage = previewObject?.type?.startsWith("image");
    const isVideo = previewObject?.type?.startsWith("video");
    return (
        <div
            className="h-10 w-10 cursor-pointer rounded-md overflow-hidden"
            onClick={onClick}
        >
            {isImage && (
                <img
                    src={previewObject.url}
                    alt="media"
                    className="w-full h-full object-cover"
                />
            )}
            {isVideo && (
                <video
                    src={previewObject.url}
                    className="w-full h-full object-cover"
                />
            )}
        </div>
    );
}
