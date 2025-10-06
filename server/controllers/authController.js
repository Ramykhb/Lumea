import {
    addUser,
    deleteRefreshTokenFromDB,
    generateAccessToken,
    generateRefreshToken,
    insertToken,
    usernameExists,
} from "../services/authService.js";

import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const accessToken = generateAccessToken({
            username: req.body.username,
        });
        const refreshToken = generateRefreshToken({
            username: req.body.username,
        });
        await addUser(req.body);
        await insertToken(req.body.username, refreshToken);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            path: "/",
            sameSite: "lax",
        });
        res.status(201).json({
            message: "User created successfully",
            accessToken: accessToken,
        });
    } catch (error) {
        res.status(500).json({
            error: "ServerError",
            message: "Something went wrong",
        });
    }
};

export const checkStatus = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.json({ loggedIn: false });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.json({ loggedIn: false });
        res.json({ loggedIn: true });
    });
};

export const login = async (req, res) => {
    const accessToken = generateAccessToken({
        username: req.body.username,
    });
    const refreshToken = generateRefreshToken({
        username: req.body.username,
    });
    await insertToken(req.body.username, refreshToken);
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        path: "/",
        sameSite: "lax",
    });
    res.status(201).json({
        message: "User logged in successfully",
        accessToken: accessToken,
    });
};

export const refreshToken = (req, res) => {
    const accessToken = generateAccessToken({ username: req.user.username });
    res.json({ accessToken: accessToken });
};

export const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    try {
        await deleteRefreshTokenFromDB(refreshToken);
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            expires: new Date(0),
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ message: "Logout failed" });
    }
};
