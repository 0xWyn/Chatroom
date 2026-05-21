import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, "..");
const UPLOADS_DIR = path.join(ROOT_DIR, "uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        console.log(ext);
        const name = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
        console.log(name);
        cb(null, name);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [
        ".jpeg",
        ".jpg",
        ".png",
        ".gif",
        ".mp4",
        ".mov",
        ".avi",
        ".webm",
    ];

    const allowedMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "video/mp4",
        "video/quicktime", // mov
        "video/x-msvideo", // avi
        "video/webm",
    ];

    const ext = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype.toLowerCase();

    if (
        allowedExtensions.includes(ext) &&
        allowedMimeTypes.includes(mimetype)
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                `Invalid file type. Allowed types: ${allowedExtensions.join(", ")}`
            )
        );
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 },
});

export default upload;
