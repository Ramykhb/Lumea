import { getID } from "../services/authService.js";
import {
    addPost,
    retrieveAllPosts,
    retrieveSaved,
    retrieveUserPosts,
    deletePost,
    retrievedFollowedPosts,
} from "../services/postService.js";

export const getAllPosts = async (req, res) => {
    const allPosts = req.query.allPosts || "true";
    const userId = await getID(req.user.username);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    let posts;
    if (allPosts == "true") {
        posts = await retrieveAllPosts(page, limit, userId);
    } else {
        posts = await retrievedFollowedPosts(page, limit, userId);
    }
    let hasMore = posts.length === limit;
    return res.status(200).json({ page, hasMore, posts: posts || [] });
};

export const getUserPosts = async (req, res) => {
    const targetId = await getID(req.params.username);
    const userId = await getID(req.user.username);
    try {
        const posts = await retrieveUserPosts(targetId, userId);
        return res.status(200).json(posts || []);
    } catch (err) {
        return res.status(500).json({ message: "Unable to retrieve posts." });
    }
};

export const getSavedPosts = async (req, res) => {
    const userId = await getID(req.user.username);
    try {
        const posts = await retrieveSaved(userId);
        return res.status(200).json(posts || []);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Unable to retrieve saved posts." });
    }
};

export const postDeletion = async (req, res) => {
    try {
        await deletePost(req.body.postId);
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: "Error performing action." });
    }
};

export const uploadImage = async (req, res) => {
    const filePath = `/uploads/${req.file.filename}`;
    return res
        .status(201)
        .json({ message: "Post Uploaded Successfully", filePath: filePath });
};

export const createPost = async (req, res) => {
    const { caption, filePath } = req.body;
    const userId = await getID(req.user.username);

    try {
        await addPost(userId, caption, filePath);
        return res.status(201).json({ message: "Post Uploaded Successfully" });
    } catch (err) {
        return res
            .status(500)
            .json({ error: "ServerError", message: "Upload failed" });
    }
};
