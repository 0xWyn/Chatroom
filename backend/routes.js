import express from "express";
import {
    createAccount,
    loginFunction,
} from "./controllers/accessController.js";
import {
    createPost,
    deletePost,
    getAllPosts,
    getPostById,
    getPostsByUserId,
    likePost,
    unlikePost,
} from "./controllers/postController.js";
import {
    deleteUserReplies,
    fetchFriendshipStatus,
    fetchUserFollowers,
    fetchUserFollowing,
    getAllUsers,
    getUserById,
    toggleFollowUser,
    updateUser,
} from "./controllers/userController.js";
import { readDB, writeDB } from "./db.js";
import upload from "./middleware/upload.js";

import {
    createChat,
    createNewMessage,
    deleteMessage,
    getChatById,
    getChatByParticipants,
    getChatMessages,
    getChatsByUserId,
    getMessageById,
} from "./controllers/chatcontroller.js";
import {
    addComment,
    deleteCommentOrReply,
    getCommentReplies,
    getPostComments,
    replyToComment,
    toggleCommentLike,
} from "./controllers/commentController.js";
import {
    deleteNotification,
    getChatNotifications,
    getNotifications,
    markAsRead,
} from "./controllers/notificationController.js";

const router = express.Router();

//ROUTES
//
//
//
//
//
//
//
// *** CHAT ROUTES *** //
//
// Create Chat
router.post("/chats", createChat);
// Get all messages for a chat
router.get("/chats/:chatId/messages", getChatMessages);
// Get chat by id
router.get("/chats/:chatId", getChatById);
// Get a chat by participants
router.get("/chats/by-users/:userId/:targetId", getChatByParticipants);
// Get chats by user Id
router.get("/users/:userId/chats", getChatsByUserId);
// Send a message
router.post("/messages", upload.single("media"), createNewMessage);
// Delete a message
router.delete("/messages/:id", deleteMessage);
// Get message by id
router.get("/messages/:messageId", getMessageById);

//
//
//
//
//
//
//
//
//
// ** ACCESS ROUTES ** //
//
// Create account
router.post("/register", createAccount);
// Login
router.post("/login", loginFunction);
//
//
//
//
//
//
//
//

// ** USER ROUTES ** //
//
// Fetch all users
router.get("/users", getAllUsers);
// Fetch one user by id
router.get("/users/:id", getUserById);
// Delete user account
router.delete("/users/:id", async (req, res) => {
    const db = await readDB();

    delete db.users[req.params.id];

    db.posts;
    await writeDB(db);
    res.json({ msg: "User deleted successfully" });
});
// Fetch user friendship status
router.get("/users/:userId/friends/:targetId", fetchFriendshipStatus);
// Delete replies by user
router.delete("/users/:id/replies", deleteUserReplies);
// Update a user
router.patch(
    "/users/:id",
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "cover", maxCount: 1 },
    ]),
    updateUser
);
// Follow or unfollow a user
router.patch("/users/:targetId/follow/:userId", toggleFollowUser);
// Feth user followers
router.get("/users/:userId/followers", fetchUserFollowers);
// Fetch user following
router.get("/users/:userId/following", fetchUserFollowing);
//
//
//
//
//
//
//
//
//
//
// *** POST ROUTES *** //
//
// Create a post
router.post(
    "/posts",
    upload.fields([
        { name: "images", maxCount: 6 },
        { name: "videos", maxCount: 1 },
    ]),
    createPost
);
// Delete a post
router.delete("/posts/:postId", deletePost);
// Get all posts
router.get("/posts", getAllPosts);
// Get all posts by a single user
router.get("/users/:id/posts", getPostsByUserId);
// Get a post by id
router.get("/posts/:id", getPostById);
// Like a post
router.post("/posts/:postId/likes/:likerId", likePost);
// Unlike a post
router.delete("/posts/:postId/likes/:likerId", unlikePost);
//
//
//
//
//
//
//
//
//
//
// *** COMMENT ROUTES *** //
//
// Add a comment
router.post("/posts/:postId/comments", addComment);
// Fetch comments for a post
router.get("/posts/:postId/comments", getPostComments);
// Toggle comment like
router.patch("/comments/:commentId/likes/:likerId", toggleCommentLike);
// Reply to a comment
router.post("/comments/:commentId/replies", replyToComment);
// Fetch replies by comment id
router.get("/comments/:commentId/replies", getCommentReplies);
// Delete a comment or reply
router.delete("/comments/:commentId", deleteCommentOrReply);
//
//
//
//
//
//
//
//
//
//
//
// *** NOTIFICATION ROUTES *** //
//
// Get notifications by user id
router.get("/notifications/:userId", getNotifications);
// Get message notifications
router.get("/notifications/:userId/messages", getChatNotifications);
// Mark notification as read
router.patch("/notifications/:id/read", markAsRead);
// Delete a notification
router.delete("/notifications/:id", deleteNotification);

// Befriend a user
router.post("/users/:targetId/friends/:userId", async (req, res) => {
    const db = await readDB();
    const { targetId, userId } = req.params;

    console.log("Target id:", targetId);
    console.log(db.users[targetId]);
    db.users[targetId].friends.push(userId.toString());
    db.users[userId].friends.push(targetId.toString());

    await writeDB(db);

    res.json({
        msg: `You are now friends with ${db.users[targetId].username}`,
    });
});

// Unfriend a user
router.delete("/users/:targetId/friends/:userId", async (req, res) => {
    const db = await readDB();

    const { targetId, userId } = req.params;

    console.log(db.users[userId]);

    const targetUserNewFriends = db.users[targetId].friends.filter(
        (u) => u !== userId.toString()
    );
    const reqUserNewFriends = db.users[userId].friends.filter(
        (u) => u !== targetId.toString()
    );
    db.users[targetId].friends = targetUserNewFriends;
    db.users[userId].friends = reqUserNewFriends;

    await writeDB(db);

    res.json({
        msg: `You are no longer friends with ${db.users[targetId].username}`,
    });
});

// Search the db
router.post("/search", async (req, res) => {
    const db = await readDB();
    const { term } = req.body;

    const searchTerms = {};

    const people = Object.values(db.users)
        .filter((name) =>
            name.username.toLowerCase().includes(term.toLowerCase())
        )
        .map((u) => {
            const user = {
                id: u.id,
                username: u.username,
            };

            return user;
        });

    searchTerms.people = people;

    const posts = Object.values(db.posts).filter(
        (post) =>
            post.text.toLowerCase().includes(term.toLowerCase()) ||
            post.author.username.toLowerCase().includes(term.toLowerCase())
    );

    searchTerms.posts = posts;

    res.json(searchTerms);
});

export default router;
