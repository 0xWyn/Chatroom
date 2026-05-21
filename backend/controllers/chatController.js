import { readDB, writeDB } from "../db.js";
import deleteFiles from "../utilities/deleteFiles.js";
import { createNotification } from "./notificationController.js";
import { io } from "../server.js";

// Create a new chat
export const createChat = async (req, res) => {
    try {
        const db = await readDB();
        const participants = req.body.participants;
        const id = crypto.randomUUID();
        const newChat = {
            id,
            participants,
            createdAt: Date.now(),
            lastMessageId: null,
        };
        db.chats[id] = newChat;
        await writeDB(db);
        res.json(newChat);
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Get all chats by user id
export const getChatsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const db = await readDB();
        const chats = Object.values(db.chats)
            .filter((chat) => chat.participants.includes(userId))
            .map((chat) => {
                const targetUser = chat.participants.find(
                    (participant) => participant !== userId
                );
                const otherParticipant = {
                    id: db.users[targetUser].id,
                    name: db.users[targetUser].name,
                    username: db.users[targetUser].username,
                    avatar: db.users[targetUser].avatar,
                };
                const lastMessage = chat.lastMessageId
                    ? db.messages[chat.lastMessageId]
                    : null;

                const hydratedChat = {
                    id: chat.id,
                    lastMessage: lastMessage
                        ? {
                              media: lastMessage.media,
                              text: lastMessage.text,
                              sender: db.users[lastMessage.sender.id].username,
                              createdAt: lastMessage.createdAt,
                          }
                        : null,
                    otherParticipant: otherParticipant,
                    createdAt: chat.createdAt,
                };

                return hydratedChat;
            })
            .sort((a, b) => b.lastMessage.createdAt - a.lastMessage.creatdAt);

        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a chat by participants
export const getChatByParticipants = async (req, res) => {
    try {
        const db = await readDB();
        const { userId, targetId } = req.params;
        const chat = Object.values(db.chats).find(
            (chat) =>
                chat.participants.includes(userId) &&
                chat.participants.includes(targetId)
        );

        if (!chat) {
            res.status(404).json({ msg: "Chat does not exists" });
        }
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a chat by chatId
export const getChatById = async (req, res) => {
    try {
        const db = await readDB();
        const { chatId } = req.params;

        const chat = db.chats[chatId];
        if (!chat) {
            res.status(404).json({ msg: "Chat does not exists" });
            return;
        }

        const participants = chat.participants.map((id) => ({
            id,
            name: db.users[id].name,
            username: db.users[id].username,
            avatar: db.users[id].avatar,
        }));

        const hydratedChat = {
            id: chat.id,
            participants,
            createdAt: chat.createdAt,
        };
        res.json(hydratedChat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Send a new message
export const createNewMessage = async (req, res) => {
    try {
        const db = await readDB();
        const media = req.file
            ? {
                  fileName: req.file?.filename,
                  mimeType: req.file?.mimetype,
              }
            : null;
        const { chatId, sender, receiverId, text } = req.body;
        const id = crypto.randomUUID();
        const newMessage = {
            id,
            chatId,
            sender: JSON.parse(sender),
            receiverId,
            text,
            media,
            createdAt: Date.now(),
        };
        db.messages[id] = newMessage;
        db.chats[chatId].lastMessageId = id;

        const notificationId = crypto.randomUUID();
        const notification = {
            id: notificationId,
            chatId,
            sender: JSON.parse(sender),
            receiverId,
            type: "message",
            read: false,
            createdAt: Date.now(),
        };

        db.notifications[notificationId] = notification;
        await writeDB(db);
        io.to(receiverId).emit("message_notification", notification);
        io.emit("new_message", newMessage);
        res.json(newMessage);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a message
export const deleteMessage = async (req, res) => {
    try {
        const db = await readDB();
        const messageId = req.params.id;
        const message = db.messages[messageId];
        message.media ? await deleteFiles(message.media) : null;
        delete db.messages[messageId];
        const lastMessage = Object.values(db.messages)
            .filter((m) => m.chatId === message.chatId)
            .reduce((latest, message) =>
                message.createdAt > latest.createdAt ? message : latest
            );
        db.chats[message.chatId].lastMessageId = lastMessage.id;
        io.to(message.chatId).emit("deleted_message", message);
        await writeDB(db);
        res.json({ message: "Your message has been deleted" });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};

// Get all messages for a specific chat
export const getChatMessages = async (req, res) => {
    try {
        const db = await readDB();
        const messages = Object.values(db.messages)
            .filter((message) => message.chatId === req.params.chatId)
            .sort((a, b) => a.createdAt - b.createdAt); // Sort messages by creation time
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a message by id
export const getMessageById = async (req, res) => {
    try {
        const { messageId } = req.params;
        const db = await readDB();
        const message = db.messages[messageId];
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
