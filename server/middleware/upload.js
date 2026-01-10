import multer from "multer";
import path from "path";
import { UPLOADS_DIR } from "../config/paths.js";

// storage engine
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, UPLOADS_DIR);
	},
	filename: (req, file, cb) => {
		const ext = path.extname(file.originalname);
		const name = `${Date.now()}-${Math.floor(Math.random() * 1e9)}${ext}`;
		cb(null, name);
	},
});

// file filter
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

	if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(mimetype)) {
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
