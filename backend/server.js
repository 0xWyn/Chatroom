import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import routes from "./routes.js";

dotenv.config();

const app = express();

const server = http.createServer(app);

const mongoURI = process.env.MONGO_URI;

export const io = new Server(server, {
    cors: { origin: "*" },
});

io.on("connection", (socket) => {
    console.log("User connected to socket:", socket.id);

    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined room: ${userId}`);
    });

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`Socket ${socket.id} joined chat ${chatId}`);
    });

    socket.on("leave_chat", (chatId) => {
        socket.leave(chatId);
    });
});

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5174",
        credentials: true,
    })
);
app.use("/uploads", express.static("uploads"));
app.use("/api", routes);

server.listen(3001, () => {
    console.log("Server running on port 3001");
});
