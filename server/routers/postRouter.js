import express from "express";
import path from "path";
import multer from "multer";
import { authenticateToken } from "../middleware/authMiddleware.js";
import {
    createPost,
    getAllPosts,
    getSavedPosts,
    uploadImage,
    getUserPosts,
    postDeletion,
} from "../controllers/postController.js";
import {
    checkGetUserPosts,
    checkImageUpload,
    checkPostDeletion,
} from "../middleware/postMiddleware.js";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

const postRouter = express.Router();

postRouter.use(express.json());

/**
 * @openapi
 * /api/v1/posts:
 *   get:
 *     summary: Get all posts
 *     description: Retrieves all posts or only followed users' posts based on the query parameter.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: allPosts
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: If "true", return all posts; if "false", return only followed users' posts.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of posts per page.
 *     responses:
 *       200:
 *         description: Successfully retrieved posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 hasMore:
 *                   type: boolean
 *                 posts:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Post data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
postRouter.get("/", authenticateToken, getAllPosts);

/**
 * @openapi
 * /api/v1/posts/get-posts/{username}:
 *   get:
 *     summary: Get posts by username
 *     description: Retrieves posts created by a specific user if their profile is public or followed.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the target profile
 *     responses:
 *       200:
 *         description: Successfully retrieved user's posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Post data
 *       400:
 *         description: Invalid request (missing username)
 *       403:
 *         description: Profile is private or not followed
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
postRouter.get(
    "/get-posts/:username",
    authenticateToken,
    checkGetUserPosts,
    getUserPosts
);

/**
 * @openapi
 * /api/v1/posts/delete-post:
 *   delete:
 *     summary: Delete a post
 *     description: Deletes a post by ID if the requester is the author.
 *     tags:
 *       - Posts
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
 *         description: Successfully deleted post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid request or unauthorized user
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
postRouter.delete(
    "/delete-post",
    authenticateToken,
    checkPostDeletion,
    postDeletion
);

/**
 * @openapi
 * /api/v1/posts/saved:
 *   get:
 *     summary: Get saved posts
 *     description: Retrieves all posts saved by the authenticated user.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved saved posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 description: Saved post data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unable to retrieve saved posts
 */
postRouter.get("/saved", authenticateToken, getSavedPosts);

/**
 * @openapi
 * /api/v1/posts/upload:
 *   post:
 *     summary: Upload an image
 *     description: Uploads a single image file for a post. The image size must not exceed 1 MB.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 filePath:
 *                   type: string
 *       400:
 *         description: Invalid request or file too large
 *       401:
 *         description: Unauthorized
 */
postRouter.post(
    "/upload",
    authenticateToken,
    upload.single("image"),
    checkImageUpload,
    uploadImage
);

/**
 * @openapi
 * /api/v1/posts/create:
 *   post:
 *     summary: Create a new post
 *     description: Creates a post with caption and uploaded image path.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - caption
 *               - filePath
 *             properties:
 *               caption:
 *                 type: string
 *                 example: Enjoying a sunny day!
 *               filePath:
 *                 type: string
 *                 example: /uploads/1698952023.jpg
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Upload failed
 */
postRouter.post("/create", authenticateToken, createPost);

export default postRouter;
