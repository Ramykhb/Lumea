import {
    addUser,
    deleteRefreshTokenFromDB,
    deleteUser,
    generateAccessToken,
    generateRefreshToken,
    insertToken,
    updatePassword,
    fetchProfile,
    editUser,
    fetchProfiles,
} from "../services/userService.js";

import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    const username = req.body.username.toLowerCase();
    try {
        const accessToken = generateAccessToken({
            username: username,
        });
        const refreshToken = generateRefreshToken({
            username: username,
        });
        await addUser(req.body);
        const success = await insertToken(username, refreshToken);
        if (success) {
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
        } else {
            res.status(500).json({
                error: "ServerError",
                message: "Something went wrong",
            });
        }
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

export const editProfile = async (req, res) => {
    const { username } = req.user;
    try {
        await editUser(req.body, username);
        return res
            .status(200)
            .json({ message: "Profile updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Unable to update profile" });
    }
};

export const getProfile = async (req, res) => {
    const username = req.params.username;

    if (!username) return res.status(403).json({ message: "Invalid Request" });

    try {
        const profile = await fetchProfile(username, req.user.username);
        return res.status(200).json(profile);
    } catch (err) {
        return res.status(403).json({ message: "Invalid Request" });
    }
};

export const getProfiles = async (req, res) => {
    const searchVal = req.query.searchVal;
    if (!searchVal) return res.status(403).json({ message: "Invalid Request" });

    try {
        const profiles = await fetchProfiles(searchVal);
        return res.status(200).json(profiles);
    } catch (err) {
        return res.status(403).json({ message: "Invalid Request" });
    }
};

export const getUser = async (req, res) => {
    return res.status(200).json({ username: req.user.username });
};

export const changePassword = async (req, res) => {
    const { username } = req.user;
    const { currentPass, newPass } = req.body;
    if (!username || !currentPass || !newPass) {
        res.status(400).json({ message: "Please fill out all fields" });
    }
    try {
        const result = await updatePassword(username, currentPass, newPass);
        if (!result) {
            return res.status(401).json({
                title: "IncorrectPassword",
                message: "Current password is incorrect.",
            });
        }
        return res.status(200).json({
            message: "Password updated successfully.",
        });
    } catch (err) {
        return res.status(500).json({
            message: "Server is unreachable at the moment.",
        });
    }
};

export const login = async (req, res) => {
    const username = req.body.username.toLowerCase();
    const accessToken = generateAccessToken({
        username: username,
    });
    const refreshToken = generateRefreshToken({
        username: username,
    });
    const success = await insertToken(username, refreshToken);
    if (success) {
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
    } else {
        return res.status(500).json({
            error: "ServerError",
            message: "Something went wrong",
        });
    }
};

export const refreshToken = (req, res) => {
    const accessToken = generateAccessToken({
        username: req.user.username.toLowerCase(),
    });
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

export const accountDeletion = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    try {
        await deleteRefreshTokenFromDB(refreshToken);
        await deleteUser(req.user.username);
        res.cookie("refreshToken", "", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            expires: new Date(0),
        });
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Account deletion failed" });
    }
};
