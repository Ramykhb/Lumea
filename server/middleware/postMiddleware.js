import pool from "../database/dbConfig.js";
import { getID } from "../services/authService.js";

import { checkAccess, getPostAuthor } from "../services/postService.js";

export const checkPostDeletion = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "Invalid request." });
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ message: "Invalid request." });
    const [postPoster] = await getPostAuthor(postId);
    const userID = await getID(req.user.username);
    if (postPoster.userId !== userID)
        return res.status(400).json({ message: "Unauthorized." });
    next();
};

export const checkGetUserPosts = async (req, res, next) => {
    const username = req.params.username;
    if (!username) {
        return res.status(400).json({ message: "Invalid request." });
    }
    const targetId = await getID(req.params.username);
    const userId = await getID(req.user.username);

    const rows = await checkAccess(targetId, userId);
    if (
        (!rows.length || rows[0].access_status === "denied") &&
        targetId != userId
    ) {
        return res
            .status(403)
            .json({ message: "Profile is private or not followed" });
    }
    next();
};

export const checkImageUpload = async (req, res, next) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Invalid Request." });
    }

    const maxSize = 1024 * 1024;

    if (file.size >= maxSize) {
        return res.status(400).json({ message: "Max file size is 1 MB." });
    }
    next();
};

export const checkPostCreation = async (req, res, next) => {
    const { caption, filePath } = req.body;
    if (!caption || !filePath) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    next();
};
