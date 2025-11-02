import express from "express";

const interactionRouter = express.Router();

import {
    commentDeletion,
    deleteNotifications,
    followProfile,
    getComments,
    getFollowers,
    getFollowing,
    getLikes,
    getNewNotifications,
    getNotifications,
    likePost,
    postComment,
    readNotifications,
    savePost,
    unfollowProfile,
    unLikePost,
    unSavePost,
} from "../controllers/interactionController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { commentDeletionMiddleware } from "../middleware/postMiddleware.js";

interactionRouter.post("/follow", authenticateToken, followProfile);

interactionRouter.delete("/follow", authenticateToken, unfollowProfile);

interactionRouter.get("/followers", authenticateToken, getFollowers);

interactionRouter.get("/following", authenticateToken, getFollowing);

interactionRouter.get("/comments", authenticateToken, getComments);

interactionRouter.get("/likes", authenticateToken, getLikes);

interactionRouter.get("/notifications", authenticateToken, getNotifications);

interactionRouter.put(
    "/read-notifications",
    authenticateToken,
    readNotifications
);

interactionRouter.delete(
    "/notifications",
    authenticateToken,
    deleteNotifications
);

interactionRouter.post("/savePost", authenticateToken, savePost);

interactionRouter.delete("/savePost", authenticateToken, unSavePost);

interactionRouter.post("/like-post", authenticateToken, likePost);

interactionRouter.get(
    "/new-notifications",
    authenticateToken,
    getNewNotifications
);

interactionRouter.delete("/like-post", authenticateToken, unLikePost);

interactionRouter.post("/comment", authenticateToken, postComment);

interactionRouter.delete(
    "/delete-comment",
    authenticateToken,
    commentDeletionMiddleware,
    commentDeletion
);

export default interactionRouter;
