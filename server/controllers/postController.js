import { getID } from "../services/userService.js";
import {
    addPost,
    retrieveAllPosts,
    retrieveComments,
    addComment,
    addSave,
    deleteSave,
    retrieveSaved,
    deleteLike,
    addLike,
    deleteComment,
    retrieveUserPosts,
    deletePost,
    retrieveLikes,
    retrieveNotifications,
    addNotification,
    isNewNotifications,
    updateNotifications,
    deleteOldNotifications,
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

export const getUserPosts = async (req, res) => {
    const user = req.params.username;
    const username = req.user.username;
    const posts = await retrieveUserPosts(user, username);
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

export const likePost = async (req, res) => {
    try {
        await addLike(req.user.username, req.body.postId);
        await addNotification(req.body.senderId, req.body.receiverId, 3);
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

export const unLikePost = async (req, res) => {
    try {
        await deleteLike(req.user.username, req.body.postId);
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: "Error performing action." });
    }
};

export const commentDeletion = async (req, res) => {
    try {
        await deleteComment(req.body.commentId);
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: "Error performing action." });
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

export const getComments = async (req, res) => {
    const postId = req.query.postId;
    const username = req.user.username;
    if (!postId) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    const comments = await retrieveComments(postId, username);
    if (!comments) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    return res.status(200).json(comments);
};

export const getLikes = async (req, res) => {
    const postId = req.query.postId;
    if (!postId) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    const likes = await retrieveLikes(postId);
    if (!likes) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    return res.status(200).json(likes);
};

export const getNotifications = async (req, res) => {
    const username = req.user.username;
    const notifications = await retrieveNotifications(username);
    if (!notifications) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    return res.status(200).json(notifications);
};

export const readNotifications = async (req, res) => {
    const username = req.user.username;
    await updateNotifications(username);
    return res.status(200).json({ message: "Notifications read successfully" });
};

export const deleteNotifications = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    await deleteOldNotifications(userId);
    return res.status(200).json({ message: "Notifications read successfully" });
};

export const getNewNotifications = async (req, res) => {
    const username = req.user.username;
    const isNew = await isNewNotifications(username);
    if (!isNew) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    return res.status(200).json(isNew);
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
    const { content, postId } = req.body;
    if (!content || !postId) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    const dateNow = new Date();
    try {
        const result = await addComment(
            req.body.senderId,
            content,
            postId,
            dateNow
        );
        await addNotification(req.body.senderId, req.body.receiverId, 4);
        return res.status(200).json({
            message: "Comment added Successfully",
            newComment: {
                id: result.insertId,
                profileImage: result["0"].profileImage,
                postId: postId,
                userId: req.body.senderId,
                posted_by: req.user.username,
                content: content,
                commentedAt: dateNow,
                isMe: true,
            },
        });
    } catch (err) {
        res.status(500).json({
            message: "Server is unreachable at the moment.",
        });
    }
};
