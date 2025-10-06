import jwt from "jsonwebtoken";
import {
    emailExists,
    getPassword,
    tokenExists,
    usernameExists,
    verifyPassword,
} from "../services/authService.js";

export const checkSignup = async (req, res, next) => {
    if (await usernameExists(req.body.username)) {
        return res.status(400).json({
            error: "UsernameAlreadyUsed",
            message: "The username is already taken...",
        });
    }
    if (await emailExists(req.body.email)) {
        return res.status(400).json({
            error: "EmailAlreadyUsed",
            message: "The email you provided is already registered...",
        });
    }

    next();
};

export const checkLogin = async (req, res, next) => {
    const hashedPassword = await getPassword(req.body.username);
    if (!hashedPassword) {
        return res.status(400).json({
            error: "IncorrectCredentials",
            message: "Username or password is incorrect...",
        });
    }
    const found = await verifyPassword(req.body.password, hashedPassword);
    if (!found) {
        return res.status(400).json({
            error: "IncorrectCredentials",
            message: "Username or password is incorrect...",
        });
    }
    next();
};

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    if (accessToken == null) {
        return res.status(401).json({
            error: "Unauthorized",
            message:
                "Unauthorized - You don't have permissions to perfom this action...",
        });
    }
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: "Unauthorized",
                message:
                    "Invalid token - You don't have permissions to perfom this action...",
            });
        }
        req.user = user;
        next();
    });
};

export const authenticateRefreshToken = async (req, res, next) => {
    const token = req.cookies.refreshToken;
    if (token == null) {
        return res.status(401).json({
            error: "Unauthorized",
            message: "Unauthorized - Please Login First",
        });
    }
    const found = await tokenExists(token);
    if (!found) {
        return res.status(403).json({
            error: "Unauthorized",
            message: "Unauthorized - Invalid Refresh Token",
        });
    }
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                error: "Unauthorized",
                message: "Unauthorized - Invalid Refresh Token",
            });
        }
        req.user = user;
        next();
    });
};
