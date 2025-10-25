import express from "express";
import path from "path";
import multer from "multer";
import { authenticateToken } from "../middleware/userMiddleware.js";
import {
    createPost,
    getAllPosts,
    getComments,
    getSavedPosts,
    likePost,
    postComment,
    savePost,
    unLikePost,
    unSavePost,
    uploadImage,
    getUserPosts,
    commentDeletion,
    postDeletion,
    getLikes,
    getNotifications,
    getNewNotifications,
    readNotifications,
    deleteNotifications,
} from "../controllers/postController.js";
import {
    commentDeletionMiddleware,
    postDeletionMiddleware,
} from "../middleware/postMiddleware.js";

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

postRouter.get("/comments", authenticateToken, getComments);

postRouter.get("/likes", authenticateToken, getLikes);

postRouter.get("/notifications", authenticateToken, getNotifications);

postRouter.put("/readNotifications", authenticateToken, readNotifications);

postRouter.delete("/notifications", authenticateToken, deleteNotifications);

postRouter.get("/saved", authenticateToken, getSavedPosts);

postRouter.post("/savePost", authenticateToken, savePost);

postRouter.delete("/savePost", authenticateToken, unSavePost);

postRouter.post("/likePost", authenticateToken, likePost);

postRouter.get("/newNotifications", authenticateToken, getNewNotifications);

postRouter.delete("/likePost", authenticateToken, unLikePost);

postRouter.post("/comment", authenticateToken, postComment);

postRouter.delete(
    "/deleteComment",
    authenticateToken,
    commentDeletionMiddleware,
    commentDeletion
);

postRouter.delete(
    "/deletePost",
    authenticateToken,
    postDeletionMiddleware,
    postDeletion
);

postRouter.post(
    "/upload",
    authenticateToken,
    upload.single("image"),
    uploadImage
);

postRouter.post("/create", authenticateToken, createPost);

export default postRouter;
