import pool from "../database/dbConfig.js";
import { getID } from "./authService.js";

export const retrieveAllPosts = async () => {
    try {
        const sql =
            "SELECT Posts.*, Users.username, Users.profileImage FROM Posts JOIN Users ON Users.id = Posts.userId ORDER BY postedAt DESC";
        const [result] = await pool.query(sql);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const retrieveComments = async (postId) => {
    try {
        const sql =
            "SELECT Commented_By.*, Users.username AS posted_by, Users.profileImage AS profileImage FROM Commented_By JOIN Users ON Users.id = Commented_By.userId WHERE postId = ? ORDER BY commentedAt DESC";
        const [result] = await pool.query(sql, [postId]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const addPost = async (username, caption, filePath) => {
    try {
        const userID = await getID(username);

        const sql =
            "INSERT INTO Posts (userId, caption, postImage, postedAt) VALUES (?, ?, ?, ?)";
        const [result] = await pool.query(sql, [
            userID,
            caption,
            filePath,
            new Date(),
        ]);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
};

export const addComment = async (userID, content, postId, dateNow) => {
    try {
        const sql =
            "INSERT INTO Commented_By (postId, userId, content, commentedAt) VALUES (?, ?, ?, ?)";
        const [result] = await pool.query(sql, [
            postId,
            userID,
            content,
            dateNow,
        ]);
        const sql2 = "SELECT profileImage FROM Users WHERE id = ?";
        const [result2] = await pool.query(sql2, [userID]);
        return { ...result, ...result2 };
    } catch (err) {
        throw err;
    }
};
