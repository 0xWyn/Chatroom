import mongoose from "mongoose";
import User from "./UserModel.js";
import Post from "./PostModel.js";

const commentSchema = new mongoose.Schema(
	{
		post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
			required: true,
			index: true,
		},

		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
		text: {
			type: String,
			trim: true,
			maxlength: 280,
		},
		media: [
			{
				url: String,
				type: {
					type: String,
					enum: ["image", "video"],
				},
			},
		],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],

		replies: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
			},
		],
		isEdited: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

commentSchema.virtual("likeCount").get(function () {
	return this.likes.length;
});

commentSchema.virtual("replyCount").get(function () {
	return this.replies.length;
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
