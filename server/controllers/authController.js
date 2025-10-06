import {
    addUser,
    generateAccessToken,
    generateRefreshToken,
    usernameExists,
} from "../services/authService.js";

export const signup = async (req, res) => {
    try {
        const accessToken = generateAccessToken({
            username: req.body.username,
        });
        const refreshToken = generateRefreshToken({
            username: req.body.username,
        });
        await addUser(req.body, refreshToken);
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

export const login = async (req, res) => {
    try {
    } catch (err) {
        res.status(500).json({
            error: "ServerError",
            message: "Something went wrong",
        });
    }
};

export const refreshToken = (req, res) => {
    const accessToken = generateAccessToken({ username: req.user.username });
    res.json({ accessToken: accessToken });
};
