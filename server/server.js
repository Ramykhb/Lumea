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
    socket.on("join", async (username) => {
        onlineUsers.set(username, socket);
        const messages = await retrieveMessages(username);
        socket.emit("messages", messages);
        await updateMessages(username);
    });

    socket.on(
        "sendMessage",
        async ({ senderUsername, receiverUsername, content }) => {
            const result = await insertMessage(
                senderUsername,
                receiverUsername,
                content
            );

            await addNotification(senderUsername, receiverUsername, 1);

            const message = {
                id: result.insertId,
                senderId: result.senderId,
                receiverId: result.receiverId,
                content: content,
                sentAt: new Date(),
                delivered: false,
            };

            socket.emit("messageDelivered", message);

            const receiverSocket = onlineUsers.get(receiverUsername);
            if (receiverSocket) {
                receiverSocket.emit("receiveMessage", message);
                await deleteMessage(message.id);
            }
        }
    );

    socket.on("disconnect", () => {
        for (const [username, userSocket] of onlineUsers.entries()) {
            if (userSocket.id === socket.id) {
                onlineUsers.delete(username);
                break;
            }
        }
    });
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
