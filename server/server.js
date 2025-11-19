import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import authRouter from "./routers/authRouter.js";
import cookieParser from "cookie-parser";
import postRouter from "./routers/postRouter.js";
import { setupChatSocket } from "./socket/chatSocket.js";
import interactionRouter from "./routers/interactionRouter.js";
import { frontendPath } from "./config/frontConfig.js";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Lumea API",
        version: "1.0.0",
        description: "API documentation for my Lumea social media app",
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Development server",
        },
    ],
};

const options = {
    swaggerDefinition,
    apis: ["./routers/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
    cors({
        origin: "*",
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
app.use("/api/v1/interactions", interactionRouter);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
