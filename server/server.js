import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routers/authRouter.js";
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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
