import mongoose from "mongoose";
import Comment from "./commentModel.js";

const postSchema = new mongoose.Schema(
	{
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
				ref: "Comment",
			},
		],

		repostOf: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Post",
		},

		isEdited: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

postSchema.virtual("likeCount").get(function () {
	return this.likes.length;
});

postSchema.virtual("replyCount").get(function () {
	return this.replies.length;
});

postSchema.pre('save', function (next) {
	this.likes = [...new Set(this.likes.map((id) => id.toString()))];
	next();
});

const Post = mongoose.model("Post", postSchema);
export default Post;
