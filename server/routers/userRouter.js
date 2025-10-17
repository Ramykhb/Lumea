import express from "express";
import multer from "multer";
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
} from "../controllers/userController.js";

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

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.post("/signup", checkSignup, signup);

userRouter.put("/editProfile", authenticateToken, editProfile);

userRouter.post("/login", checkLogin, login);

userRouter.put("/updatePassword", authenticateToken, changePassword);

userRouter.get("/profile/:username", authenticateToken, getProfile);

userRouter.get("/profiles", authenticateToken, getProfiles);

userRouter.get("/status", checkStatus);

userRouter.get("/user", authenticateToken, getUser);

userRouter.post("/refresh", authenticateRefreshToken, refreshToken);

userRouter.post("/logout", logout);

userRouter.delete("/deleteAccount", authenticateToken, accountDeletion);

export default userRouter;
