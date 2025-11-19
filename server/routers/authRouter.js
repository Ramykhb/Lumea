import express from "express";
import {
    checkSignup,
    authenticateToken,
    authenticateRefreshToken,
    checkLogin,
    checkProfileEdit,
    checkPasswordUpdate,
    checkGetProfile,
    checkSearchInput,
    checkEmailReset,
    authenticateForgetToken,
    checkResetPassword,
} from "../middleware/authMiddleware.js";
import {
    changePassword,
    checkStatus,
    login,
    logout,
    refreshToken,
    signup,
    getProfile,
    getProfiles,
    getUser,
    editProfile,
    accountDeletion,
    forgetPassword,
    checkForgetToken,
    resetPassword,
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.use(express.json());

/**
 * @openapi
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns an access token and user ID.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - name
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 id:
 *                   type: integer
 *       400:
 *         description: Missing or invalid fields
 *       409:
 *         description: Username or email already used
 *       500:
 *         description: Server error
 */
authRouter.post("/signup", checkSignup, signup);

/**
 * @openapi
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns access and refresh tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *                 id:
 *                   type: integer
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
authRouter.post("/login", checkLogin, login);

/**
 * @openapi
 * /api/v1/auth/edit-profile:
 *   put:
 *     summary: Edit user profile
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     description: Updates the authenticated user's profile information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isPublic
 *               - bio
 *               - name
 *               - profileImage
 *             properties:
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *               bio:
 *                 type: string
 *                 example: "Animal lover and pet sitter"
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               profileImage:
 *                 type: string
 *                 example: "https://example.com/profile.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid or missing fields
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
authRouter.put(
    "/edit-profile",
    authenticateToken,
    checkProfileEdit,
    editProfile
);

/**
 * @openapi
 * /api/v1/auth/update-password:
 *   put:
 *     summary: Update user password
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     description: Allows a logged-in user to change their password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPass
 *               - newPass
 *             properties:
 *               currentPass:
 *                 type: string
 *                 example: oldPassword123
 *               newPass:
 *                 type: string
 *                 example: newPassword456
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Incorrect current password
 *       500:
 *         description: Server error
 */
authRouter.put(
    "/update-password",
    authenticateToken,
    checkPasswordUpdate,
    changePassword
);

/**
 * @openapi
 * /api/v1/auth/profile/{username}:
 *   get:
 *     summary: Get a user's profile
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the profile to fetch
 *     responses:
 *       200:
 *         description: Profile data retrieved successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
authRouter.get(
    "/profile/:username",
    authenticateToken,
    checkGetProfile,
    getProfile
);

/**
 * @openapi
 * /api/v1/auth/profiles:
 *   get:
 *     summary: Search user profiles
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     parameters:
 *       - in: query
 *         name: searchVal
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term for filtering profiles
 *     responses:
 *       200:
 *         description: List of profiles matching the search
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
authRouter.get("/profiles", authenticateToken, checkSearchInput, getProfiles);

/**
 * @openapi
 * /api/v1/auth/status:
 *   post:
 *     summary: Check user authentication status
 *     tags:
 *       - Authentication
 *     description: Checks if a user is logged in using the refresh token cookie.
 *     responses:
 *       200:
 *         description: Returns loggedIn boolean and access token if valid
 *       500:
 *         description: Server error
 */
authRouter.post("/status", checkStatus);

/**
 * @openapi
 * /api/v1/auth/user:
 *   get:
 *     summary: Get logged-in user's data
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Returns username and user ID
 *       401:
 *         description: Unauthorized
 */
authRouter.get("/user", authenticateToken, getUser);

/**
 * @openapi
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags:
 *       - Authentication
 *     description: Generates a new access token using a valid refresh token cookie.
 *     responses:
 *       200:
 *         description: Returns new access token
 *       401:
 *         description: Missing or invalid refresh token
 *       403:
 *         description: Unauthorized refresh token
 */
authRouter.post("/refresh", authenticateRefreshToken, refreshToken);

/**
 * @openapi
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags:
 *       - Authentication
 *     description: Deletes refresh token from the database and clears the cookie.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       204:
 *         description: No content (no token to delete)
 *       500:
 *         description: Logout failed
 */
authRouter.post("/logout", logout);

/**
 * @openapi
 * /api/v1/auth/delete-account:
 *   delete:
 *     summary: Delete user account
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     description: Deletes the logged-in user's account and removes refresh token.
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       204:
 *         description: No refresh token found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Account deletion failed
 */
authRouter.delete("/delete-account", authenticateToken, accountDeletion);

/**
 * @openapi
 * /api/v1/auth/forget-password:
 *   post:
 *     summary: Request a password reset
 *     description: Sends a password reset link to the user's registered email address.
 *     tags:
 *       - Password Reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Invalid or missing email
 *       404:
 *         description: Email not found in database
 *       500:
 *         description: Server error
 */
authRouter.post("/forget-password", checkEmailReset, forgetPassword);

/**
 * @openapi
 * /api/v1/auth/check-token:
 *   post:
 *     summary: Verify password reset token
 *     description: Validates the password reset token sent to the user's email before allowing password change.
 *     tags:
 *       - Password Reset
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token verified successfully
 *       401:
 *         description: Invalid or expired token
 */
authRouter.post("/check-token", authenticateForgetToken, checkForgetToken);

/**
 * @openapi
 * /api/v1/auth/reset-password:
 *   put:
 *     summary: Reset user password
 *     description: Resets the user's password using a valid password reset token.
 *     tags:
 *       - Password Reset
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: newSecurePass123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Missing or invalid password
 *       401:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
authRouter.put(
    "/reset-password",
    authenticateForgetToken,
    checkResetPassword,
    resetPassword
);

export default authRouter;
