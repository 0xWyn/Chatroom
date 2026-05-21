import Cropper from "react-easy-crop";
import { useState } from "react";

export default function AvatarCropper({ image, onComplete }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center">
            <div className="relative w-[300px] h-[300px] bg-black">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    cropShape="round"
                />
            </div>
            <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="mt-4 w-[300px]"
            />
            <button
                className="mt-4 bg-blue-500 !px-4 text-white"
                onClick={() => onComplete(croppedAreaPixels)}
            >
                Crop
            </button>
            <button
                className="mt-2 bg-gray-400 px-4 py-2 text-white"
                onClick={() => onComplete(null)}
            >
                Cancel
            </button>
        </div>
    );
}
