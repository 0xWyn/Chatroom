import { readDB, writeDB } from "../db.js";
import { io } from "../server.js";

export const createNotification = async ({ userId, type, content, db }) => {
    try {
        console.log("Creating notification for:", userId);
        const id = crypto.randomUUID();
        const notification = {
            id,
            userId,
            type,
            content,
            read: false,
            createdAt: Date.now(),
        };

        db.notifications[id] = notification;
        io.to(userId).emit("new_notification", notification);
        return notification;
    } catch (error) {
        console.error(error);
    }
};

export const createMessageNotification = async ({ receiverId, db }) => {
    try {
        const id = crypto.randomUUID;
        const notification = {
            id,
            receiverId,
            type: "message",
            read: false,
            createdAt: Date.now(),
        };

        db.notifications[id] = notification;
        io.to(receiverId).emit("message_notification", notification);
        return notification;
    } catch (error) {
        console.error(error);
    }
};

export const getChatNotifications = async (req, res) => {
    try {
        const { userId } = req.params;
        const db = await readDB();
        const notifications = Object.values(db.notifications).filter(
            (n) =>
                n.receiverId === userId &&
                n.type === "message" &&
                n.read === false
        );
        res.json(notifications);
    } catch (error) {
        console.error(error);
    }
};

export const getNotifications = async (req, res) => {
    try {
        const db = await readDB();
        const { userId } = req.params;

        const notifications = Object.values(db.notifications)
            .filter((n) => n.userId === userId.toString())
            .sort((a, b) => b.createdAt - a.createdAt);

        res.json(notifications);
    } catch (error) {
        console.error(error);
    }
};

export const markAsRead = async (req, res) => {
    try {
        const db = await readDB();
        const { id } = req.params;
        if (db.notifications[id]) {
            db.notifications[id].read = true;
            await writeDB(db);
        }
        res.json(db.notifications[id]);
    } catch (error) {
        console.error(error);
    }
};

export const deleteNotification = async (req, res) => {
    try {
        const db = await readDB();
        const { id } = req.params;
        if (db.notifications[id]) {
            const userId = db.notifications[id].userId;
            delete db.notifications[id];
            await writeDB(db);
            io.to(userId).emit("notification_deleted", id);
        }
        res.json({ success: true });
    } catch (error) {
        console.error(error);
    }
};
