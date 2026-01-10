import express from "express";
import User from "../models/UserModel.js";
import Post from "../models/PostModel.js";

const router = express.Router();

router.get("/", (req, res) => {
	res.send("Hello from the backend!");
});

router.get("/users", async (req, res) => {
	try {
		const users = await User.find({}).select("username email _id password");
		return res.status(200).json({
			data: users,
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ message: error.message });
	}
});

router.get("/posts", async (req, res) => {
	try {
		const posts = await Post.find({});

		return res.status(200).json({
			data: posts || [],
		});
	} catch (error) {
		console.log(error.message);
		return res.status(500).json({ message: error.message });
	}
});

//get posts by user
router.get("/posts/:id/", async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });

		if (!posts.length) {
			return res
				.status(404)
				.json({ message: `No posts found for ${user.username}` });
		}

		return res.status(200).json({
			status: "Request successful",
			postsCount: posts.length,
			data: posts,
		});
	} catch (err) {
		console.error(err.message);
		return res.status(500).json({
			status: `Get posts by user request was unsucessful.`,
			message: err.message,
		});
	}
});

export default router;
