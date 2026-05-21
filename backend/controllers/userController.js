import { readDB, writeDB } from "../db.js";
import { io } from "../server.js";

// Get all users for whatever reason
export const getAllUsers = async (req, res) => {
    console.log("Getting all users");
    try {
        const db = await readDB();
        res.json(Object.values(db.users));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Get a single user by Id
export const getUserById = async (req, res) => {
    try {
        const db = await readDB();
        const { id } = req.params;
        const user = db.users[id.toString()];
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    try {
        const db = await readDB();
        const { id } = req.params;
        const user = db.users[id];
        const postsByUser = Object.values(db.posts).filter(
            (post) => post.author.id === id
        );
        postsByUser.forEach((post) => {
            deletePost((req.params.postId = post.id));
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Delete all posts by user
export const deleteUserPosts = async (req, res) => {
    try {
        const db = await readDB();
        const { userId } = req.params.id;
        const usersPosts = Object.values(db.posts).filter(
            (post) => post.author.id === userId.toString()
        );
        for (const post of usersPosts) {
            if (post.media.images) {
                await deleteFiles(post.media.images);
            }
            if (post.media.videos) {
                await deleteFiles(post.media.videos);
            }
        }
        usersPosts.forEach((post) => {
            delete db.posts[post];
        });
        await writeDB();
        res.json({
            message: `All posts by ${db.users[userId].username} deleted`,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete all comments by user
export const deleteUserComments = async (req, res) => {
    try {
        const db = await readDB();
        const { userId } = req.params;
        const usersComments = Object.values(db.comments)
            .filter((comment) => comment.author.id === userId.toString())
            .forEach((comment) => {
                const parentPost = db.posts[comment.main];
                const newComments = parentPost.comments.filter(
                    (c) => c !== comment
                );
                db.posts[comment.main].comments = newComments;
                const deleteReplies = Object.values(db.comments)
                    .filter((reply) => reply.parent === comment)
                    .forEach((reply) => {
                        delete db.comments[reply];
                    });
                delete db.comments[comment];
            });

        res.json({ message: "Comments deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete all replies by user
export const deleteUserReplies = async (req, res) => {
    try {
        const db = await readDB();
        const userId = req.params.id;
        const userReplies = Object.values(db.comments).filter((comment) => {
            comment === userId.toString();
        });
        userReplies.forEach((reply) => {
            const newReplies = db.comments[reply.parent].replies.filter(
                (r) => r !== reply
            );
            db.comments[reply.parent] = newReplies;
            delete db.replies[reply];
        });
        res.json({ message: "Replies deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Fetch friendship status
export const fetchFriendshipStatus = async (req, res) => {
    try {
        const db = await readDB();
        const { userId, targetId } = req.params;
        const user = db.users[userId];
        const isFollowing = user.friends.includes(targetId.toString());
        res.json({ isFollowing });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Follow a user
// Follow is preferable to friends as it reduces the need of inundating users with friend-requests

export const toggleFollowUser = async (req, res) => {
    try {
        const db = await readDB();
        const { targetId, userId } = req.params;
        const targetUser = db.users[targetId];
        const user = db.users[userId];
        const isFollowing = user?.following?.includes(targetId.toString());
        if (isFollowing) {
            db.users[userId].following = user.following.filter(
                (id) => id !== targetId.toString()
            );
            db.users[targetId].followers = targetUser.followers.filter(
                (id) => id !== userId.toString()
            );
        } else {
            db.users[userId].following.push(targetId.toString());
            db.users[targetId].followers.push(userId.toString());
        }

        await writeDB(db);
        const updates = {
            actor: db.users[userId],
            target: db.users[targetId],
        };
        io.emit("follow_update", updates);
        res.json(db.users[targetId]);
    } catch (error) {
        console.error(error);
    }
};

// Update user account information
export const updateUser = async (req, res) => {
    try {
        const db = await readDB();
        const { id } = req.params;
        const user = db.users[id];
        const { username, bio } = req.body;
        let avatarUrl = user.avatar;
        let coverUrl = user.cover;
        if (req.files.avatar) {
            avatarUrl = `/uploads/${req.files.avatar[0].filename}`;
        }
        if (req.files.cover) {
            coverUrl = `/uploads/${req.files.cover[0].filename}`;
        }
        user.username = username;
        user.bio = bio;
        user.avatar = avatarUrl;
        user.cover = coverUrl;
        db.users[id] = user;
        await writeDB(db);
        res.json(db.users[id]);
    } catch (error) {
        console.error(error);
    }
};

export const fetchUserFollowers = async (req, res) => {
    try {
        const db = await readDB();
        const { userId } = req.params;
        const followers = Object.values(db.users).filter((user) =>
            user.following.includes(userId.toString())
        );
        const results = followers.map((u) => ({
            id: u.id,
            name: u.name,
            username: u.username,
            bio: u.bio,
            avatar: u.avatar,
        }));
        res.json(results);
    } catch (error) {
        console.error(error);
    }
};

export const fetchUserFollowing = async (req, res) => {
    try {
        const db = await readDB();
        const { userId } = req.params;
        const following = Object.values(db.users).filter((user) =>
            user.followers.includes(userId.toString())
        );

        const results = following.map((u) => ({
            id: u.id,
            name: u.name,
            username: u.username,
            bio: u.bio,
            avatar: u.avatar,
        }));
        res.json(results);
    } catch (error) {
        console.error(error);
    }
};
