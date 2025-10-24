import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import userRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import postRouter from "./routers/postRouter.js";
import { Server } from "socket.io";
import {
    deleteMessage,
    insertMessage,
    retrieveMessages,
    updateMessages,
} from "./services/chatService.js";
import { addNotification } from "./services/postService.js";
import { getID } from "./services/userService.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        // origin: "https://b1hqqjqw-5173.euw.devtunnels.ms",
        methods: ["GET", "POST"],
    },
});

app.use(
    cors({
        origin: "http://localhost:5173",
        // origin: "https://b1hqqjqw-5173.euw.devtunnels.ms",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const onlineUsers = new Map();

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/posts", postRouter);

io.on("connection", (socket) => {
    socket.on("join", async (username, target) => {
        const primaryId = await getID(username);
        const secondaryId = await getID(target);
        onlineUsers.set(primaryId, { socket, secondaryId });
        const messages = await retrieveMessages(username, target);
        socket.emit("messages", messages);
        await updateMessages(username, target);
    });

    socket.on(
        "sendMessage",
        async ({ senderUsername, receiverUsername, content }) => {
            const senderId = await getID(senderUsername);
            const receiverId = await getID(receiverUsername);

            const result = await insertMessage(senderId, receiverId, content);

            const message = {
                id: result.insertId,
                senderId: senderId,
                receiverId: receiverId,
                content: content,
                sentAt: new Date(),
                delivered: false,
            };

            socket.emit("messageDelivered", message);

            const receiverSocket = onlineUsers.get(receiverId);
            if (receiverSocket && receiverSocket.secondaryId === senderId) {
                receiverSocket.socket.emit("receiveMessage", message);
                await deleteMessage(message.id);
            } else {
                await addNotification(senderUsername, receiverUsername, 1);
            }
        }
    );

    socket.on("disconnect", () => {
        for (const [primaryId, userSocket] of onlineUsers.entries()) {
            if (userSocket.socket.id === socket.id) {
                onlineUsers.delete(primaryId);
                break;
            }
        }
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
