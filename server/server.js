import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routers/userRouter.js";
import cookieParser from "cookie-parser";
import postRouter from "./routers/postRouter.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/posts", postRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
