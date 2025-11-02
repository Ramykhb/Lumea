import express from "express";
import path from "path";
import multer from "multer";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
    createPost,
    getAllPosts,
    getSavedPosts,
    uploadImage,
    getUserPosts,
    postDeletion,
} from "../controllers/postController.js";
import { postDeletionMiddleware } from "../middleware/postMiddleware.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

const postRouter = express.Router();

postRouter.use(express.json());

postRouter.get("/", authenticateToken, getAllPosts);

postRouter.get("/getposts/:username", authenticateToken, getUserPosts);

postRouter.delete(
    "/deletePost",
    authenticateToken,
    postDeletionMiddleware,
    postDeletion
);

postRouter.get("/saved", authenticateToken, getSavedPosts);

postRouter.post(
    "/upload",
    authenticateToken,
    upload.single("image"),
    uploadImage
);

postRouter.post("/create", authenticateToken, createPost);

export default postRouter;
