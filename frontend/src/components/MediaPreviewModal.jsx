import XMark from "../assets/x-mark";
import GoodMark from "../assets/goodmark";

export default function MediaPreviewModal({
    previewObject,
    onReject,
    onAccept,
}) {
    if (!previewObject?.url || !previewObject?.type) return null;

    let preview = null;

    if (previewObject.type === "image") {
        preview = (
            <img
                src={previewObject.url}
                alt="media"
                className="w-full h-full object-contain"
            />
        );
    } else {
        preview = (
            <video
                src={previewObject.url}
                alt="media"
                controls
                className="w-full h-full object-contain"
            />
        );
    }

    return (
        <div className="absolute h-screen w-screen inset-0 z-50 flex justify-center bg-black/90 transition-opacity duration-200">
            <div className="flex items-center justify-center relative">
                {/* Remove Media */}
                <div className="z-10">
                    <button
                        className="absolute top-1 right-1 !p-2 !m-0 hover:text-red-700 bg-gray-500"
                        onClick={onReject}
                    >
                        <XMark />
                    </button>
                    {/* Accept Media */}
                    <button
                        className="absolute top-1 left-1 !p-2 !m-0 hover:text-green-700 bg-gray-500"
                        onClick={onAccept}
                    >
                        <GoodMark />
                    </button>
                </div>
                {preview}
            </div>
        </div>
    );
}
