import express from "express";
import jwt from "jsonwebtoken";
import {
    checkSignup,
    authenticateToken,
    authenticateRefreshToken,
} from "../middleware/authMiddleware.js";
import { login, refreshToken, signup } from "../controllers/authController.js";
import { tokenExists } from "../services/authService.js";

const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post("/signup", checkSignup, signup);

authRouter.post("/login", login);

authRouter.get("/status", (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.json({ loggedIn: false });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.json({ loggedIn: false });
        res.json({ loggedIn: true });
    });
});

authRouter.get("/temp", authenticateToken, (req, res) => {
    console.log(req.user);
});

authRouter.post("/refresh", authenticateRefreshToken, refreshToken);

export default authRouter;
