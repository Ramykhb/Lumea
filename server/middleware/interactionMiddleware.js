import { fetchProfile, getID } from "../services/authService.js";
import {
    getCommentAuthor,
    isFollowed,
} from "../services/interactionService.js";
import { getPostAuthor } from "../services/postService.js";

export const checkCommentDeletion = async (req, res, next) => {
    const userID = await getID(req.user.username);
    if (!req.body) return res.status(400).json({ message: "Invalid request." });
    const { commentId } = req.body;
    if (!commentId)
        return res.status(400).json({ message: "Invalid request." });
    const [commentPoster] = await getCommentAuthor(commentId);
    if (commentPoster.userId !== userID)
        return res.status(400).json({ message: "Unauthorized." });
    next();
};

export const checkFollow = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "Invalid request." });
    const { profileUsername } = req.body;
    const senderId = await getID(req.user.username);
    if (!profileUsername) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    const receiverId = await getID(profileUsername);
    if (senderId === receiverId) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    const profile = await fetchProfile(profileUsername, req.user.username);
    if (profile.isPublic == false) {
        return res.status(403).json({ message: "Profile is private." });
    }
    req.senderId = senderId;
    req.receiverId = receiverId;
    next();
};

export const checkUnfollow = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "Invalid request." });
    const { profileUsername } = req.body;
    const senderId = await getID(req.user.username);
    if (!profileUsername) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    const receiverId = await getID(profileUsername);
    if (senderId === receiverId) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    req.senderId = senderId;
    req.receiverId = receiverId;
    next();
};

export const checkFollowingFollowers = async (req, res, next) => {
    if (!req.query)
        return res.status(400).json({ message: "Invalid request." });
    const profileUsername = req.query.username;
    if (!profileUsername) {
        return res.status(400).json({ message: "Invalid Request." });
    }
    next();
};

export const checkGetComments = async (req, res, next) => {
    try {
        const { postId } = req.query;
        const senderId = await getID(req.user.username);

        if (!postId) {
            return res.status(400).json({ message: "Invalid Request." });
        }

        const [postPoster] = await getPostAuthor(postId);

        const postOwnerId = postPoster.userId;

        const profile = await fetchProfile(
            postPoster.username,
            req.user.username
        );
        if (profile.isPublic == false) {
            const followResult = await isFollowed(senderId, postOwnerId);

            if (followResult.length === 0 && senderId !== postOwnerId) {
                return res.status(403).json({
                    message:
                        "You are not allowed to view comments for this post.",
                });
            }
        }
        req.senderId = senderId;
        next();
    } catch (error) {
        console.error("Error in checkGetComments:", error);
        res.status(500).json({ message: "Server error." });
    }
};

export const checkGetLikes = async (req, res, next) => {
    try {
        const { postId } = req.query;
        const senderId = await getID(req.user.username);

        if (!postId) {
            return res.status(400).json({ message: "Invalid Request." });
        }

        const [postPoster] = await getPostAuthor(postId);

        const postOwnerId = postPoster.userId;

        const profile = await fetchProfile(
            postPoster.username,
            req.user.username
        );
        if (profile.isPublic == false) {
            const followResult = await isFollowed(senderId, postOwnerId);

            if (followResult.length === 0 && senderId !== postOwnerId) {
                return res.status(403).json({
                    message: "You are not allowed to view likes for this post.",
                });
            }
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
};

export const checkSavePost = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "Invalid request." });
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ message: "Invalid request." });
    const userId = await getID(req.user.username);

    const [postPoster] = await getPostAuthor(postId);

    const postOwnerId = postPoster.userId;

    const profile = await fetchProfile(postPoster.username, req.user.username);
    if (profile.isPublic == false) {
        const followResult = await isFollowed(userId, postOwnerId);

        if (followResult.length === 0 && userId !== postOwnerId) {
            return res.status(403).json({
                message: "You are not allowed to save this post.",
            });
        }
    }
    req.userId = userId;
    next();
};

export const checkUnsavePost = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "Invalid request." });
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ message: "Invalid request." });
    const userId = await getID(req.user.username);
    req.userId = userId;
    next();
};

export const checklikePost = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "Invalid request." });
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ message: "Invalid request." });
    const senderId = await getID(req.user.username);

    const [postPoster] = await getPostAuthor(postId);

    const postOwnerId = postPoster.userId;

    const profile = await fetchProfile(postPoster.username, req.user.username);
    if (profile.isPublic == false) {
        const followResult = await isFollowed(senderId, postOwnerId);

        if (followResult.length === 0 && senderId !== postOwnerId) {
            return res.status(403).json({
                message: "You are not allowed to like this post.",
            });
        }
    }
    req.senderId = senderId;
    req.receiverId = postOwnerId;
    next();
};

export const checkUnlikePost = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "Invalid request." });
    const { postId } = req.body;
    if (!postId) return res.status(400).json({ message: "Invalid request." });
    const userId = await getID(req.user.username);
    req.userId = userId;
    next();
};

export const checkPostComment = async (req, res, next) => {
    if (!req.body) return res.status(400).json({ message: "Invalid request." });
    const { postId, content } = req.body;
    if (!postId || !content)
        return res.status(400).json({ message: "Invalid request." });
    const senderId = await getID(req.user.username);

    const [postPoster] = await getPostAuthor(postId);

    const postOwnerId = postPoster.userId;

    const profile = await fetchProfile(postPoster.username, req.user.username);
    if (profile.isPublic == false) {
        const followResult = await isFollowed(senderId, postOwnerId);

        if (followResult.length === 0 && senderId !== postOwnerId) {
            return res.status(403).json({
                message: "You are not allowed to like this post.",
            });
        }
    }
    req.senderId = senderId;
    req.receiverId = postOwnerId;
    next();
};
