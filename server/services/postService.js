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
            ORDER BY postedAt DESC
            LIMIT ? OFFSET ?;
        `;

        const [result] = await pool.query(sql, [
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

export const retrieveUserPosts = async (user, username) => {
    const userID = await getID(username);
    const profileID = await getID(user);
    try {
        const sql =
            "SELECT Posts.*, Users.username, Users.id AS posterID, Users.profileImage, EXISTS (SELECT 1 FROM Liked_By WHERE Liked_By.postId = Posts.id AND Liked_By.userId = ?) AS isLiked, EXISTS (SELECT 1 FROM Saved_By WHERE Saved_By.postId = Posts.id AND Saved_By.userId = ?) AS isSaved, (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) as likes FROM Posts JOIN Users ON Users.id = Posts.userId WHERE Posts.userId = ? ORDER BY postedAt DESC";
        const [result] = await pool.query(sql, [userID, userID, profileID]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const retrieveSaved = async (username) => {
    const userID = await getID(username);
    try {
        const sql =
            "SELECT Posts.*, Users.username,Users.id AS posterID, Users.profileImage, EXISTS (SELECT 1 FROM Liked_By WHERE Liked_By.postId = Posts.id AND Liked_By.userId = ?) AS isLiked, EXISTS (SELECT 1 FROM Saved_By WHERE Saved_By.postId = Posts.id AND Saved_By.userId = ?) AS isSaved, (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) as likes FROM Posts JOIN Users ON Users.id = Posts.userId WHERE Posts.id IN (SELECT postId FROM Saved_By WHERE userId = ?) ORDER BY postedAt DESC";
        const [result] = await pool.query(sql, [userID, userID, userID]);
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
        const sql = "SELECT userId FROM Posts WHERE id = ?";
        const [result] = await pool.query(sql, [postId]);
        return result;
    } catch (err) {
        throw err;
    }
};
