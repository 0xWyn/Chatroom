import { readDB, writeDB } from "../db.js";
import { io } from "../server.js";
import deleteFiles from "../utilities/deleteFiles.js";
import { createNotification } from "./notificationController.js";
// Get posts by user id
export const getPostsByUserId = async (req, res) => {
    try {
        const db = await readDB();

        const { id } = req.params;
        const posts = Object.values(db.posts)
            .filter((post) => post.author.id === id.toString())
            .sort((a, b) => b.createdAt - a.createdAt);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a post
export const createPost = async (req, res) => {
    try {
        console.log("At createPost fn");
        const db = await readDB();
        const { author, text } = req.body;
        const id = crypto.randomUUID();
        const images = req.files?.images?.map((file) => file.filename) || [];
        const videos = req.files?.videos?.map((file) => file.filename) || [];
        const post = {
            id,
            author: JSON.parse(author),
            text,
            media: {
                images,
                videos,
            },
            replyCount: 0,
            likes: [],
            createdAt: Date.now(),
        };

        db.posts[id] = post;
        await writeDB(db);
        io.emit("new_post", post);
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Delete a post by id
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const db = await readDB();
        const post = db.posts[postId.toString()];
        const comments = Object.values(db.comments).filter(
            (c) => c.parentPostId === post.id
        );
        comments?.forEach((comment) => {
            delete db.comments[comment.id];
        });
        if (post.media?.images?.length > 0) {
            await deleteFiles(post.media.images);
        }
        if (post.media?.videos?.length) {
            await deleteFiles(post.media.videos);
        }
        delete db.posts[postId.toString()];
        await writeDB(db);
        io.emit("deleted_post", post);
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error });
    }
};

// Fetch all db.posts
export const getAllPosts = async (req, res) => {
    try {
        const db = await readDB();
        const deleteOrphanedComments = () => {
            const orphanedComments = Object.values(db.comments).filter(
                (c) =>
                    !(
                        db.comments[c.parentCommentId] ||
                        db.posts[c.parentPostId]
                    )
            );

            orphanedComments?.forEach((c) => delete db.comments[c.id]);
        };
        deleteOrphanedComments();
        await writeDB(db);
        const posts = Object.values(db.posts).sort(
            (a, b) => b.createdAt - a.createdAt
        );
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Fetch a post by id
export const getPostById = async (req, res) => {
    try {
        const db = await readDB();
        const { id } = req.params;
        const post = db.posts[id];
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Like a post
export const likePost = async (req, res) => {
    try {
        const db = await readDB();
        const { postId, likerId } = req.params;
        db.posts[postId].likes.push(likerId);
        const post = db.posts[postId];
        const authorId = db.posts[postId].author.id;
        await createNotification({
            userId: authorId,
            type: "post like",
            content: `Your post was liked by ${db.users[likerId].username}`,
            db,
        });
        io.emit("liked_post", post);
        io.emit("testing_socket", post);
        await writeDB(db);
        res.json({ message: "Like added!" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Unlike a post
export const unlikePost = async (req, res) => {
    try {
        console.log("hitting unliked post");
        const db = await readDB();
        const { postId, likerId } = req.params;
        const likes = db.posts[postId].likes;
        const newLikes = likes.filter((like) => like !== likerId.toString());
        db.posts[postId].likes = newLikes;
        const post = db.posts[postId];
        await writeDB(db);
        io.emit("unliked_post", post);
        res.json({ message: "Like removed!" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
