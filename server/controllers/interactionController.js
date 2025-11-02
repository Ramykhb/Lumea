import {
    addComment,
    addLike,
    addNotification,
    addSave,
    deleteComment,
    deleteLike,
    deleteOldNotifications,
    deleteSave,
    followUser,
    isNewNotifications,
    retrieveComments,
    retrieveFollowers,
    retrieveFollowing,
    retrieveLikes,
    retrieveNotifications,
    unfollowUser,
    updateNotifications,
} from "../services/interactionService.js";

export const followProfile = async (req, res) => {
    const { senderId, receiverId } = req.body;
    if (!senderId || !receiverId || senderId === receiverId) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    try {
        await followUser(senderId, receiverId);
        await addNotification(senderId, receiverId, 2);
        return res
            .status(200)
            .json({ message: "Profile followed successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Unable to follow profile" });
    }
};

export const getFollowers = async (req, res) => {
    const profileUsername = req.query.username;
    if (!profileUsername) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    try {
        let followers = await retrieveFollowers(profileUsername);
        return res.status(200).json(followers);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Unable to retrieve followers." });
    }
};

export const getFollowing = async (req, res) => {
    const profileUsername = req.query.username;
    if (!profileUsername) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    try {
        let following = await retrieveFollowing(profileUsername);
        return res.status(200).json(following);
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Unable to retrieve following." });
    }
};

export const unfollowProfile = async (req, res) => {
    const myUsername = req.user.username;
    const profileUsername = req.body.username;
    if (!profileUsername || myUsername === profileUsername) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    try {
        await unfollowUser(myUsername, profileUsername);
        return res
            .status(200)
            .json({ message: "Profile unfollowed successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Unable to unfollow profile" });
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

export const savePost = async (req, res) => {
    try {
        await addSave(req.user.username, req.body.postId);
        return res.status(201).json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: "Error performing action." });
    }
};

export const likePost = async (req, res) => {
    try {
        await addLike(req.user.username, req.body.postId);
        await addNotification(req.body.senderId, req.body.receiverId, 3);
        return res.status(201).json({ success: true });
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
        return res.status(201).json({
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
        return res.status(500).json({
            message: "Server is unreachable at the moment.",
        });
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
        return res.status(401).json({
            title: "Likes not found",
            message: "No likes where found for this post.",
        });
    }
    return res.status(200).json(likes);
};

export const getNotifications = async (req, res) => {
    const username = req.user.username;
    const notifications = await retrieveNotifications(username);
    return res.status(200).json(notifications || []);
};

export const readNotifications = async (req, res) => {
    const username = req.user.username;
    await updateNotifications(username);
    return res.status(200).json({ message: "Notifications read successfully" });
};

export const deleteNotifications = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    try {
        await deleteOldNotifications(userId);
        return res
            .status(200)
            .json({ message: "Notifications deleted successfully" });
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Error deleting notifications" });
    }
};

export const getNewNotifications = async (req, res) => {
    const username = req.user.username;
    const isNew = await isNewNotifications(username);
    return res.status(200).json(isNew || []);
};
