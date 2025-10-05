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

authRouter.get("/temp", authenticateToken, (req, res) => {
    console.log(req.user);
});

authRouter.post("/token", authenticateRefreshToken, refreshToken);

export default authRouter;
