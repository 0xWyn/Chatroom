import Post from "../models/PostModel.js";
import fs from "fs/promises";
import path from "path";
import { UPLOADS_DIR } from "../config/paths.js";

export const createPost = async (req, res) => {
	try {
		const { text } = req.body;

		if (
			!text &&
			(!req.files || (!req.files.images?.length && !req.files.videos?.length))
		) {
			return res.status(400).json({ message: "Post must not be empty" });
		}

		const media = [
			...(req.files.images || []),
			...(req.files.videos || []),
		].map((file) => ({
			url: `/uploads/${file.filename}`,
			type: file.mimetype.startsWith("video") ? "video" : "image",
		}));

		const newPost = new Post({
			user: req.user._id,
			text,
			media,
		});

		await newPost.save();

		res.status(201).json({
			message: "Post created successfully",
			post: {
				_id: newPost._id,
				user: newPost.user,
				text: newPost.text,
				media: newPost.media,
				likes: newPost.likes,
				replies: newPost.replies,
				isEdited: newPost.isEdited,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		const author = post.user.toString();
		const user = req.user._id.toString();

		if (user !== author) {
			return res.status(403).json({
				message: "Only author is authorised to delete post",
			});
		}

		const deleteFilePromises = post.media.map((file) => {
			const filePath = path.join(UPLOADS_DIR, path.basename(file.url));
			return fs.unlink(filePath).catch((err) => {
				console.error(`Failed to delete file ${filePath}:`, err);
			});
		});

		await Promise.all(deleteFilePromises); // wait for all files to be deleted

		await post.deleteOne();

		return res.status(200).json({
			message: "Post deleted successfully",
		});
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			message: "Delete request unsuccessful",
		});
	}
};

export const likePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		const post = await Post.findByIdAndUpdate(
			postId,
			{ $addToSet: { likes: userId } },
			{ new: true }
		);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		return res.status(201).json({
			message: "Post liked",
			likeCount: post.likeCount,
			data: post,
		});
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ message: "Server error", error: error.message });
	}
};

export const unlikePost = async (req, res) => {
	try {
		const userId = req.user._id;
		const postId = req.params.id;

		const post = await Post.findByIdAndUpdate(
			postId,
			{ $pull: { likes: userId } },
			{ new: true }
		);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		return res.status(201).json({
			message: "Post unliked",
			likeCount: post.likeCount,
			data: post,
		});
	} catch (error) {
		console.error(error.message);
		return res
			.status(500)
			.json({ message: "Server error", error: error.message });
	}
};
