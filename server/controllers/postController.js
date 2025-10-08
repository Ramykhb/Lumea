import {
    addPost,
    retrieveAllPosts,
    retrieveComments,
    addComment,
} from "../services/postService.js";

export const getAllPosts = async (req, res) => {
    const posts = await retrieveAllPosts();
    if (!posts) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    res.json(posts);
};

export const getComments = async (req, res) => {
    const comments = await retrieveComments(req.query.postId);
    if (!comments) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    res.json(comments);
};

export const createPost = async (req, res) => {
    const { caption } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No image uploaded" });
    const filePath = `/uploads/${file.filename}`;
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
    const { content, postId } = req.body;
    const success = await addComment(username, content, postId);
    if (success) {
        return res.status(200).json({ message: "Comment added Successfully" });
    }
    return res
        .status(500)
        .json({ error: "ServerError", message: "Comment failed" });
};
