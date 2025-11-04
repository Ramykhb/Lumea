import pool from "../database/dbConfig.js";
import { getID } from "./authService.js";

export const retrieveAllPosts = async (page = 1, limit = 5, userId) => {
    try {
        const offset = (page - 1) * limit;

        const sql = `
            SELECT 
                Posts.*, 
                Users.username, 
                Users.id AS posterID, 
                Users.profileImage, 
                Users.isPublic,
                EXISTS (
                    SELECT 1 FROM Liked_By 
                    WHERE Liked_By.postId = Posts.id 
                    AND Liked_By.userId = ?
                ) AS isLiked,
                EXISTS (
                    SELECT 1 FROM Saved_By 
                    WHERE Saved_By.postId = Posts.id 
                    AND Saved_By.userId = ?
                ) AS isSaved,
                (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) AS likes,
                EXISTS (
                    SELECT 1 FROM Followed_By 
                    WHERE followerId = ? AND followingId = Users.id
                ) AS isFollowed
            FROM Posts
            JOIN Users ON Users.id = Posts.userId
            WHERE 
                Users.isPublic = 1
                OR Users.id IN (
                    SELECT followingId FROM Followed_By WHERE followerId = ?
                )
                OR Users.id = ?
            ORDER BY postedAt DESC
            LIMIT ? OFFSET ?;
        `;

        const [result] = await pool.query(sql, [
            userId,
            userId,
            userId,
            userId,
            userId,
            limit,
            offset,
        ]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
        throw err;
    }
};

export const retrievedFollowedPosts = async (page = 1, limit = 5, userId) => {
    try {
        const offset = (page - 1) * limit;

        const sql = `
            SELECT 
                Posts.*, 
                Users.username, 
                Users.id AS posterID, 
                Users.profileImage, 
                Users.isPublic,
                EXISTS (
                    SELECT 1 FROM Liked_By 
                    WHERE Liked_By.postId = Posts.id 
                    AND Liked_By.userId = ?
                ) AS isLiked,
                EXISTS (
                    SELECT 1 FROM Saved_By 
                    WHERE Saved_By.postId = Posts.id 
                    AND Saved_By.userId = ?
                ) AS isSaved,
                (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) AS likes,
                1 AS isFollowed
            FROM Posts
            JOIN Users ON Users.id = Posts.userId
            WHERE Posts.userId IN (
                SELECT followingId FROM Followed_By WHERE followerId = ?
            )
            ORDER BY postedAt DESC
            LIMIT ? OFFSET ?;
        `;

        const [result] = await pool.query(sql, [
            userId,
            userId,
            userId,
            limit,
            offset,
        ]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
        throw err;
    }
};

export const retrieveUserPosts = async (targetId, userId) => {
    try {
        const sql =
            "SELECT Posts.*, Users.username, Users.id AS posterID, Users.profileImage, EXISTS (SELECT 1 FROM Liked_By WHERE Liked_By.postId = Posts.id AND Liked_By.userId = ?) AS isLiked, EXISTS (SELECT 1 FROM Saved_By WHERE Saved_By.postId = Posts.id AND Saved_By.userId = ?) AS isSaved, (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) as likes FROM Posts JOIN Users ON Users.id = Posts.userId WHERE Posts.userId = ? ORDER BY postedAt DESC";
        const [result] = await pool.query(sql, [userId, userId, targetId]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const checkAccess = async (targetId, userId) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
            CASE
                WHEN u.isPublic = 1 THEN 'allowed'
                WHEN u.isPublic = 0 AND f.followerId IS NOT NULL THEN 'allowed'
                ELSE 'denied'
            END AS access_status
         FROM Users u
         LEFT JOIN Followed_By f 
            ON f.followingId = u.id 
            AND f.followerId = ?
         WHERE u.id = ?`,
            [userId, targetId]
        );
        return rows;
    } catch (err) {
        console.error("Error Querying Database:", err);
        throw err;
    }
};

export const retrieveSaved = async (userId) => {
    try {
        const sql =
            "SELECT Posts.*, Users.username,Users.id AS posterID, Users.profileImage, EXISTS (SELECT 1 FROM Liked_By WHERE Liked_By.postId = Posts.id AND Liked_By.userId = ?) AS isLiked, EXISTS (SELECT 1 FROM Saved_By WHERE Saved_By.postId = Posts.id AND Saved_By.userId = ?) AS isSaved, (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) as likes FROM Posts JOIN Users ON Users.id = Posts.userId WHERE Posts.id IN (SELECT postId FROM Saved_By WHERE userId = ?) ORDER BY postedAt DESC";
        const [result] = await pool.query(sql, [userId, userId, userId]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const addPost = async (userId, caption, filePath) => {
    try {
        const sql =
            "INSERT INTO Posts (userId, caption, postImage, postedAt) VALUES (?, ?, ?, ?)";
        const [result] = await pool.query(sql, [
            userId,
            caption,
            filePath,
            new Date(),
        ]);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const deletePost = async (postId) => {
    try {
        const sql = "DELETE FROM Posts WHERE id = ?";
        const [result] = await pool.query(sql, [postId]);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getPostAuthor = async (postId) => {
    try {
        const sql =
            "SELECT userId, Users.username as username FROM Posts JOIN Users ON Posts.userId = Users.id WHERE Posts.id = ?";
        const [result] = await pool.query(sql, [postId]);
        return result;
    } catch (err) {
        throw err;
    }
};
