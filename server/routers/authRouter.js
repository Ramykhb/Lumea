import express from "express";
import {
    checkSignup,
    authenticateToken,
    authenticateRefreshToken,
    checkLogin,
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

authRouter.put("/edit-profile", authenticateToken, editProfile);

authRouter.post("/login", checkLogin, login);

authRouter.put("/updatePassword", authenticateToken, changePassword);

authRouter.get("/profile/:username", authenticateToken, getProfile);

authRouter.get("/profiles", authenticateToken, getProfiles);

authRouter.get("/status", checkStatus);

authRouter.get("/user", authenticateToken, getUser);

authRouter.post("/refresh", authenticateRefreshToken, refreshToken);

authRouter.post("/logout", logout);

authRouter.delete("/deleteAccount", authenticateToken, accountDeletion);

export default authRouter;
