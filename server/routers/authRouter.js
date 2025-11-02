import express from "express";
import {
    checkSignup,
    authenticateToken,
    authenticateRefreshToken,
    checkLogin,
} from "../middleware/userMiddleware.js";
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
    followProfile,
    unfollowProfile,
    getFollowers,
    getFollowing,
} from "../controllers/userController.js";

const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post("/signup", checkSignup, signup);

authRouter.put("/editProfile", authenticateToken, editProfile);

authRouter.post("/login", checkLogin, login);

authRouter.put("/updatePassword", authenticateToken, changePassword);

authRouter.get("/profile/:username", authenticateToken, getProfile);

authRouter.get("/profiles", authenticateToken, getProfiles);

authRouter.get("/status", checkStatus);

authRouter.get("/user", authenticateToken, getUser);

authRouter.post("/refresh", authenticateRefreshToken, refreshToken);

authRouter.post("/follow", authenticateToken, followProfile);

authRouter.get("/followers", authenticateToken, getFollowers);

authRouter.get("/following", authenticateToken, getFollowing);

authRouter.delete("/follow", authenticateToken, unfollowProfile);

authRouter.post("/logout", logout);

authRouter.delete("/deleteAccount", authenticateToken, accountDeletion);

export default authRouter;
