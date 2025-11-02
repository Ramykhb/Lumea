import { getID } from "../services/authService.js";
import { getCommentAuthor } from "../services/interactionService.js";

export const commentDeletionMiddleware = async (req, res, next) => {
    const userID = await getID(req.user.username);
    if (!req.body) return res.status(403).json({ message: "Invalid request." });
    const { commentId } = req.body;
    if (!commentId)
        return res.status(403).json({ message: "Invalid request." });
    const [commentPoster] = await getCommentAuthor(commentId);
    if (commentPoster.userId !== userID)
        return res.status(400).json({ message: "Unauthorized." });
    next();
};
