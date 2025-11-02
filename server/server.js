import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import authRouter from "./routers/authRouter.js";
import cookieParser from "cookie-parser";
import postRouter from "./routers/postRouter.js";
import { setupChatSocket } from "./socket/chatSocket.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: "http://localhost:5173",
        // origin: "https://b1hqqjqw-5173.euw.devtunnels.ms",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

const server = http.createServer(app);

setupChatSocket(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
