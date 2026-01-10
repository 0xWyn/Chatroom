import express from "express";
import {
	createPost,
	deletePost,
	likePost,
	unlikePost,
} from "../controllers/postController.js";
import { addComment } from "../controllers/commentController.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//Create Post
router.post(
	"/",
	authenticate,
	upload.fields([
		{ name: "images", maxCount: 5 },
		{ name: "videos", maxCount: 2 },
	]),
	createPost
);

//Delete Post
router.delete("/:id", authenticate, deletePost);

//Like Post
router.post("/:id/like", authenticate, likePost);

//Unlike Post
router.delete("/:id/like", authenticate, unlikePost);

//Add Comment
router.post("/:id/comment", authenticate, addComment);

//Delete Comment
// router.delete("/:id/comment", authenticate, removeComment);

export default router;
