import Post from "../models/PostModel.js";
import Comment from "../models/commentModel.js";

export const addComment = async (req, res) => {
	try {
		const text = req.body.text;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text || !text.trim())
			return res.status(400).json({ message: "Comment cannot be empty" });

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}
		const comment = new Comment({
			user: userId,
			post: postId,
			text: text.trim(),
		});

		await comment.save();

		await Post.findByIdAndUpdate(
			postId,
			{ $addToSet: { replies: comment._id } },
			{ new: true }
		);

		return res.status(201).json({
			message: "Comment created successfully",
			post: [post.text, post.media],
			comment: comment.text,
		});
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			message: "Server error. Add comment request unsuccessful",
			error: error.message,
		});
	}
};

export const deleteComment = async (req, res) => {
	try {
		const { postId, commentId } = req.params;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(404).json({ message: "Comment not found" });
		}

		await Post.findByIdAndUpdate(
			postId,
			{ $pull: { replies: commentId } },
			{ new: true }
		);

        await Comment.findByIdAndDelete(commentId);

        return res.status("")
	} catch (error) {}
};
