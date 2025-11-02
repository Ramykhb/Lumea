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
} from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post("/signup", checkSignup, signup);

authRouter.post("/login", checkLogin, login);

authRouter.put(
    "/edit-profile",
    authenticateToken,
    checkProfileEdit,
    editProfile
);

authRouter.put(
    "/update-password",
    authenticateToken,
    checkPasswordUpdate,
    changePassword
);

authRouter.get(
    "/profile/:username",
    authenticateToken,
    checkGetProfile,
    getProfile
);

authRouter.get("/profiles", authenticateToken, checkSearchInput, getProfiles);

authRouter.get("/status", checkStatus);

authRouter.get("/user", authenticateToken, getUser);

authRouter.post("/refresh", authenticateRefreshToken, refreshToken);

authRouter.post("/logout", logout);

authRouter.delete("/delete-account", authenticateToken, accountDeletion);

export default authRouter;
