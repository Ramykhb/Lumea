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
import {
    checkCommentDeletion,
    checkFollow,
    checkFollowingFollowers,
    checkGetComments,
    checkGetLikes,
    checklikePost,
    checkPostComment,
    checkSavePost,
    checkUnfollow,
    checkUnlikePost,
    checkUnsavePost,
} from "../middleware/interactionMiddleware.js";

/**
 * @openapi
 * /api/v1/interactions/follow:
 *   post:
 *     summary: Follow a user
 *     description: Sends a follow request to another user if their profile is public.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profileUsername
 *             properties:
 *               profileUsername:
 *                 type: string
 *                 example: "johndoe"
 *     responses:
 *       200:
 *         description: Profile followed successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Profile is private
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unable to follow profile
 */
interactionRouter.post(
    "/follow",
    authenticateToken,
    checkFollow,
    followProfile
);

/**
 * @openapi
 * /api/v1/interactions/follow:
 *   delete:
 *     summary: Unfollow a user
 *     description: Unfollows a previously followed profile.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - profileUsername
 *             properties:
 *               profileUsername:
 *                 type: string
 *                 example: "johndoe"
 *     responses:
 *       200:
 *         description: Profile unfollowed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unable to unfollow profile
 */
interactionRouter.delete(
    "/follow",
    authenticateToken,
    checkUnfollow,
    unfollowProfile
);

/**
 * @openapi
 * /api/v1/interactions/followers:
 *   get:
 *     summary: Get followers of a user
 *     description: Retrieves all followers of the specified username.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username whose followers are to be retrieved.
 *     responses:
 *       200:
 *         description: Successfully retrieved followers
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unable to retrieve followers
 */
interactionRouter.get(
    "/followers",
    authenticateToken,
    checkFollowingFollowers,
    getFollowers
);

/**
 * @openapi
 * /api/v1/interactions/following:
 *   get:
 *     summary: Get following list
 *     description: Retrieves all profiles followed by the specified username.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username whose following list is to be retrieved.
 *     responses:
 *       200:
 *         description: Successfully retrieved following list
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unable to retrieve following list
 */
interactionRouter.get(
    "/following",
    authenticateToken,
    checkFollowingFollowers,
    getFollowing
);

/**
 * @openapi
 * /api/v1/interactions/comments:
 *   get:
 *     summary: Get comments for a post
 *     description: Retrieves comments on a specific post if allowed.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 12
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Access denied for private profile
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.get(
    "/comments",
    authenticateToken,
    checkGetComments,
    getComments
);

/**
 * @openapi
 * /api/v1/interactions/likes:
 *   get:
 *     summary: Get post likes
 *     description: Retrieves all users who liked a specific post.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 42
 *         description: ID of the post
 *     responses:
 *       200:
 *         description: Successfully retrieved likes
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Not allowed to view likes
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.get("/likes", authenticateToken, checkGetLikes, getLikes);

/**
 * @openapi
 * /api/v1/interactions/notifications:
 *   get:
 *     summary: Get all notifications
 *     description: Retrieves all notifications for the logged-in user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved notifications
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.get("/notifications", authenticateToken, getNotifications);

/**
 * @openapi
 * /api/v1/interactions/read-notifications:
 *   put:
 *     summary: Mark notifications as read
 *     description: Marks all notifications of the logged-in user as read.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications marked as read
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.put(
    "/read-notifications",
    authenticateToken,
    readNotifications
);

/**
 * @openapi
 * /api/v1/interactions/notifications:
 *   delete:
 *     summary: Delete old notifications
 *     description: Deletes all expired or old notifications for the logged-in user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Error deleting notifications
 */
interactionRouter.delete(
    "/notifications",
    authenticateToken,
    deleteNotifications
);

/**
 * @openapi
 * /api/v1/interactions/save-post:
 *   post:
 *     summary: Save a post
 *     description: Saves a post for the logged-in user.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       201:
 *         description: Post saved successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Not allowed to save post
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.post(
    "/save-post",
    authenticateToken,
    checkSavePost,
    savePost
);

/**
 * @openapi
 * /api/v1/interactions/save-post:
 *   delete:
 *     summary: Unsave a post
 *     description: Removes a post from the user's saved list.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       200:
 *         description: Post unsaved successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.delete(
    "/save-post",
    authenticateToken,
    checkUnsavePost,
    unSavePost
);

/**
 * @openapi
 * /api/v1/interactions/like-post:
 *   post:
 *     summary: Like a post
 *     description: Likes a post and notifies the post owner.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       201:
 *         description: Post liked successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Not allowed to like post
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.post(
    "/like-post",
    authenticateToken,
    checklikePost,
    likePost
);

/**
 * @openapi
 * /api/v1/interactions/like-post:
 *   delete:
 *     summary: Unlike a post
 *     description: Removes the user's like from a post.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 42
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.delete(
    "/like-post",
    authenticateToken,
    checkUnlikePost,
    unLikePost
);

/**
 * @openapi
 * /api/v1/interactions/new-notifications:
 *   get:
 *     summary: Check for new notifications
 *     description: Returns whether the logged-in user has new notifications.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved new notification status
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.get(
    "/new-notifications",
    authenticateToken,
    getNewNotifications
);

/**
 * @openapi
 * /api/v1/interactions/comment:
 *   post:
 *     summary: Add a comment
 *     description: Posts a new comment on a post and notifies the post owner.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - content
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 45
 *               content:
 *                 type: string
 *                 example: "Nice picture!"
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Not allowed to comment
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.post(
    "/comment",
    authenticateToken,
    checkPostComment,
    postComment
);

/**
 * @openapi
 * /api/v1/interactions/delete-comment:
 *   delete:
 *     summary: Delete a comment
 *     description: Deletes a comment if it belongs to the logged-in user.
 *     tags:
 *       - Interactions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - commentId
 *             properties:
 *               commentId:
 *                 type: integer
 *                 example: 99
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid request or unauthorized
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
interactionRouter.delete(
    "/delete-comment",
    authenticateToken,
    checkCommentDeletion,
    commentDeletion
);

export default interactionRouter;
