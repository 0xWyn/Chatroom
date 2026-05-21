import { useEffect, useState } from "react";

export default function viewVideo({ file }) {
    const [video, setVideo] = useState(null);
    if (file) {
        setVideo(file);
    } else {
        return;
    }

    const url = URL.createObjectURL(file);

    const [previewURl, setPreviewUrl] = useState(url);

    useEffect(() => URL.revokeObjectURL(file), [file]);

    return previewURl;
}
