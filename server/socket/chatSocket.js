import { Server } from "socket.io";
import {
    deleteMessage,
    insertMessage,
    retrieveMessages,
    updateMessages,
} from "../services/chatService.js";
import { addNotification } from "../services/interactionService.js";

const onlineUsers = new Map();

export const setupChatSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            // origin: "https://b1hqqjqw-5173.euw.devtunnels.ms",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on("join", async (primaryId, secondaryId) => {
            onlineUsers.set(primaryId, { socket, secondaryId });
            const messages = await retrieveMessages(primaryId, secondaryId);
            socket.emit("messages", messages);
            await updateMessages(primaryId, secondaryId);
        });

        socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
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
                await addNotification(senderId, receiverId, 1);
            }
        });

        socket.on("disconnect", () => {
            for (const [primaryId, userSocket] of onlineUsers.entries()) {
                if (userSocket.socket.id === socket.id) {
                    onlineUsers.delete(primaryId);
                    break;
                }
            }
        });
    });
};
