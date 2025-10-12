import { getID } from "../services/authService.js";
import {
    addPost,
    retrieveAllPosts,
    retrieveComments,
    addComment,
    addSave,
    deleteSave,
    retrieveSaved,
} from "../services/postService.js";

export const getAllPosts = async (req, res) => {
    const allPosts = req.query.allPosts;
    const { username } = req.user;
    const posts = await retrieveAllPosts(allPosts, username);
    if (!posts) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    res.json(posts);
};

export const getSavedPosts = async (req, res) => {
    const { username } = req.user;
    const posts = await retrieveSaved(username);
    if (!posts) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    res.status(200).json(posts);
};

export const savePost = async (req, res) => {
    try {
        await addSave(req.user.username, req.body.postId);
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: "Error performing action." });
    }
};

export const unSavePost = async (req, res) => {
    try {
        await deleteSave(req.user.username, req.body.postId);
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: "Error performing action." });
    }
};

export const getComments = async (req, res) => {
    const postId = req.query.postId;
    if (!postId) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    const comments = await retrieveComments(postId);
    if (!comments) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    res.status(200).json(comments);
};

export const uploadImage = async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    const filePath = `/uploads/${file.filename}`;
    return res
        .status(200)
        .json({ message: "Post Uploaded Successfully", filePath: filePath });
};

export const createPost = async (req, res) => {
    const { caption, filePath } = req.body;
    if (!caption || !filePath) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    const success = await addPost(req.user.username, caption, filePath);
    if (success) {
        return res.status(200).json({ message: "Post Uploaded Successfully" });
    }
    return res
        .status(500)
        .json({ error: "ServerError", message: "Upload failed" });
};

export const postComment = async (req, res) => {
    const { username } = req.user;
    const userID = await getID(username);
    const { content, postId } = req.body;
    if (!content || !postId) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    const dateNow = new Date();
    try {
        const result = await addComment(userID, content, postId, dateNow);
        return res.status(200).json({
            message: "Comment added Successfully",
            newComment: {
                id: result.insertId,
                profileImage: result["0"].profileImage,
                postId: postId,
                userId: userID,
                posted_by: username,
                content: content,
                commentedAt: dateNow,
            },
        });
    } catch (err) {
        res.status(500).message("Server is unreachable at the moment.");
    }
};
