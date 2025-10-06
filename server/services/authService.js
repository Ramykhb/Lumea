import pool from "../database/dbConfig.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export async function usernameExists(username) {
    try {
        const sql = "SELECT COUNT(*) as count FROM Users WHERE username = ?";
        const [result] = await pool.query(sql, [username]);
        return result[0].count > 0;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
}

export async function getID(username) {
    try {
        const sql = "SELECT id FROM Users WHERE username = ?";
        const [result] = await pool.query(sql, [username]);
        return result[0].id;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
}

export async function getPassword(username) {
    try {
        const sql = "SELECT password FROM Users WHERE username = ?";
        const [result] = await pool.query(sql, [username]);
        if (result.length == 0) return null;
        return result[0].password;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
}

export async function tokenExists(refreshToken) {
    try {
        const sql =
            "SELECT COUNT(*) AS count FROM Refresh_Tokens WHERE token = ?";
        const [result] = await pool.query(sql, [refreshToken]);
        return result[0].count > 0;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
}

export async function emailExists(email) {
    try {
        const sql = "SELECT COUNT(*) AS count FROM Users WHERE email = ?";
        const [result] = await pool.query(sql, [email]);
        return result[0].count > 0;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
}

export async function insertToken(username, refreshToken) {
    let userID = await getID(username);
    try {
        const sql = "INSERT INTO Refresh_Tokens VALUES (?,?)";
        const [result] = await pool.query(sql, [refreshToken, userID]);
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
}

export async function addUser({ username, name, email, password }) {
    const hashedPassword = await hashPassword(password);
    try {
        const sql =
            "INSERT INTO Users (name, username, email, password, isPublic) VALUES (?,?,?,?, TRUE)";
        const [result] = await pool.query(sql, [
            name,
            username,
            email,
            hashedPassword,
        ]);
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
}

export const deleteRefreshTokenFromDB = async (refreshToken) => {
    try {
        const sql = "DELETE FROM Refresh_Tokens WHERE token = ?";
        const [result] = await pool.query(sql, [refreshToken]);
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export async function hashPassword(plainPassword) {
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    return hash;
}

export async function verifyPassword(plainPassword, hashFromDb) {
    const match = await bcrypt.compare(plainPassword, hashFromDb);
    return match;
}

export function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
}

export function generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}
