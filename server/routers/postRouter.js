import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { getAllPosts } from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.use(express.json());

postRouter.get("/", authenticateToken, getAllPosts);

export default postRouter;
