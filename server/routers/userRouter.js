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
    accountDeletion,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/signup", checkSignup, signup);

userRouter.post("/login", checkLogin, login);

userRouter.put("/updatePassword", authenticateToken, changePassword);

userRouter.get("/profile/:username", authenticateToken, getProfile);

userRouter.get("/profiles", authenticateToken, getProfiles);

userRouter.get("/status", checkStatus);

userRouter.post("/refresh", authenticateRefreshToken, refreshToken);

userRouter.post("/logout", logout);

userRouter.delete("/deleteAccount", authenticateToken, accountDeletion);

export default userRouter;
