import jwt from "jsonwebtoken";
import {
    emailExists,
    getPassword,
    tokenExists,
    usernameExists,
    verifyPassword,
} from "../services/authService.js";

export const checkSignup = async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "Request body cannot be empty" });
    }
    const { username, email, name, password } = req.body;
    if (!username || !email || !name || !password) {
        return res.status(400).json({ message: "Please fill out all fields" });
    }
    try {
        const usernameFound = await usernameExists(
            req.body.username.toLowerCase()
        );
        if (usernameFound) {
            return res.status(409).json({
                error: "UsernameAlreadyUsed",
                message: "The username is already taken...",
            });
        }
        const emailFound = await emailExists(req.body.email);
        if (emailFound) {
            return res.status(409).json({
                error: "EmailAlreadyUsed",
                message: "The email you provided is already registered...",
            });
        }

        next();
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server is unreachable at the moment." });
    }
};

export const checkLogin = async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "Request body cannot be empty" });
    }
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Please fill out all fields" });
    }
    try {
        const hashedPassword = await getPassword(
            req.body.username.toLowerCase()
        );
        if (!hashedPassword) {
            return res.status(401).json({
                error: "IncorrectCredentials",
                message: "Invalid Credentials.",
            });
        }
        const found = await verifyPassword(req.body.password, hashedPassword);
        if (!found) {
            return res.status(401).json({
                error: "IncorrectCredentials",
                message: "Invalid Credentials.",
            });
        }
        next();
    } catch (err) {
        return res
            .status(500)
            .json({ message: "Server is unreachable at the moment." });
    }
};

export const checkProfileEdit = async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "Request body cannot be empty" });
    }
    const { isPublic, bio, name, profileImage } = req.body;
    if (isPublic == null || !bio || !name || !profileImage) {
        return res.status(400).json({ message: "Please fill out all fields" });
    }
    next();
};

export const checkEmailReset = async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "Request body cannot be empty" });
    }
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Invalid request." });
    const emailFound = await emailExists(email);
    if (!emailFound) {
        return res.status(404).json({
            error: "EmailNotFound",
            message:
                "The email you provided is not associated with any account.",
        });
    }
    next();
};

export const checkPasswordUpdate = async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "Request body cannot be empty" });
    }
    const { currentPass, newPass } = req.body;
    if (!currentPass || !newPass) {
        return res.status(400).json({ message: "Please fill out all fields" });
    }
    next();
};

export const checkGetProfile = async (req, res, next) => {
    const username = req.params.username;
    if (!username) return res.status(400).json({ message: "Invalid Request" });
    next();
};

export const checkSearchInput = async (req, res, next) => {
    const searchVal = req.query.searchVal;
    if (!searchVal) return res.status(400).json({ message: "Invalid Request" });
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

export const authenticateForgetToken = (req, res, next) => {
    const token = req.body.token;
    if (!token) return res.status(400).json({ message: "Invalid Request" });
    if (token == null) {
        return res.status(401).json({
            error: "Unauthorized",
            message:
                "Unauthorized - You don't have permissions to perfom this action...",
        });
    }
    jwt.verify(token, process.env.FORGET_TOKEN_SECRET, (err, user) => {
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

export const checkResetPassword = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res
            .status(400)
            .json({ message: "Request body cannot be empty" });
    }
    const { newPass } = req.body;
    if (!newPass) return res.status(400).json({ message: "Invalid request." });
    next();
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
