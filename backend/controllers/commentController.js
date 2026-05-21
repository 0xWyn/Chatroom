import { readDB, writeDB } from "../db.js";
import { io } from "../server.js";

// Comment on a post
export const addComment = async (req, res) => {
    try {
        const db = await readDB();
        const { postId } = req.params;
        const { comment, author } = req.body;
        const id = crypto.randomUUID();
        const newComment = {
            id,
            comment,
            author,
            parentPostId: postId,
            parentCommentId: null,
            replyCount: 0,
            likes: [],
            createdAt: Date.now(),
        };
        db.comments[id] = newComment;
        db.posts[postId].replyCount += 1;
        await writeDB(db);
        const post = db.posts[postId];
        io.emit("updated_post", post);
        io.emit("new_comment", newComment);
        res.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error });
    }
};

// Delete a comment by id

// Get comments by post id
export const getPostComments = async (req, res) => {
    try {
        const db = await readDB();
        const { postId } = req.params;
        const comments = Object.values(db.comments)
            .filter(
                (comment) =>
                    comment.parentPostId === postId.toString() &&
                    comment.parentCommentId === null
            )
            .sort((a, b) => b.createdAt - a.createdAt);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Toggle like for a comment
export const toggleCommentLike = async (req, res) => {
    try {
        const db = await readDB();
        const { commentId, likerId } = req.params;
        const likes = db.comments[commentId].likes;
        const isLiked = likes.includes(likerId.toString());
        db.comments[commentId].likes = isLiked
            ? likes.filter((id) => id !== likerId.toString())
            : [...likes, likerId.toString()];
        await writeDB(db);
        const comment = db.comments[commentId];
        if (comment.parentCommentId) {
            io.emit("updated_reply", comment);
        } else {
            io.emit("updated_comment", comment);
        }
        res.json({ message: isLiked ? "Like removed" : "Like added" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while toggling the like",
        });
    }
};

// Reply to a comment
export const replyToComment = async (req, res) => {
    try {
        const db = await readDB();
        const { commentId } = req.params;
        const { comment, replyTo, author } = req.body;
        const id = crypto.randomUUID();
        const parentPostId = db.comments[commentId].parentPostId;
        const newReply = {
            id,
            comment,
            author,
            parentPostId,
            replyTo,
            parentCommentId: commentId,
            likes: [],
            replyCount: 0,
            createdAt: Date.now(),
        };
        db.comments[id] = newReply;
        db.comments[commentId].replyCount += 1;
        db.posts[parentPostId].replyCount += 1;
        await writeDB(db);
        const parentPost = db.posts[parentPostId];
        io.emit("updated_post", parentPost);

        io.emit("new_reply", newReply);
        res.json({ message: "Reply added successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Get comment replies
export const getCommentReplies = async (req, res) => {
    try {
        const db = await readDB();
        const { commentId } = req.params;
        const replies = Object.values(db.comments)
            .filter(
                (comment) => comment.parentCommentId === commentId.toString()
            )
            .sort((a, b) => b.createdAt - a.createdAt);
        res.json(replies);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Delete a comment or reply
export const deleteCommentOrReply = async (req, res) => {
    try {
        const db = await readDB();
        const { commentId } = req.params;
        const comment = db.comments[commentId];
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        const isTopLevel = !comment.parentCommentId;
        if (isTopLevel) {
            db.posts[comment.parentPostId].replyCount -= 1;
            const childReplies = Object.entries(db.comments).filter(
                ([__, comment]) =>
                    comment.parentCommentId === commentId.toString()
            );
            for (const [id] of childReplies) {
                delete db.comments[id];
                db.posts[comment.parentPostId].replyCount -= 1;
            }
        } else {
            db.comments[comment.parentCommentId].replyCount -= 1;
            db.posts[comment.parentPostId].replyCount -= 1;
            io.emit("deleted_reply", comment);
        }
        const updatedPost = db.posts[comment.parentPostId];

        delete db.comments[commentId];
        await writeDB(db);
        io.emit("updated_post", updatedPost);
        res.json({ message: "Comment deleted succesfully" });
    } catch (error) {
        console.error(error);
    }
};
