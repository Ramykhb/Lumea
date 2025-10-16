import pool from "../database/dbConfig.js";
import { getID } from "./userService.js";

export const retrieveAllPosts = async (allPosts, username) => {
    const userID = await getID(username);
    let sql;
    if (allPosts === "true") {
        sql =
            "SELECT Posts.*, Users.username, Users.profileImage, Users.isPublic, EXISTS (SELECT 1 FROM Liked_By WHERE Liked_By.postId = Posts.id AND Liked_By.userId = ?) AS isLiked, EXISTS (SELECT 1 FROM Saved_By WHERE Saved_By.postId = Posts.id AND Saved_By.userId = ?) AS isSaved, (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) as likes, EXISTS (SELECT 1 FROM Followed_By WHERE followerId = ? AND followingId = Users.id) AS isFollowed FROM Posts JOIN Users ON Users.id = Posts.userId ORDER BY postedAt DESC";
    } else {
        sql =
            "SELECT Posts.*, Users.username, Users.profileImage, Users.isPublic, EXISTS (SELECT 1 FROM Liked_By WHERE Liked_By.postId = Posts.id AND Liked_By.userId = ?) AS isLiked, EXISTS (SELECT 1 FROM Saved_By WHERE Saved_By.postId = Posts.id AND Saved_By.userId = ?) AS isSaved, (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) as likes FROM Posts JOIN Users ON Users.id = Posts.userId WHERE Posts.userId IN (SELECT followingId FROM Followed_by WHERE followerId = ?) ORDER BY postedAt DESC";
    }
    try {
        const [result] = await pool.query(sql, [userID, userID, userID]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const retrieveUserPosts = async (user, username) => {
    const userID = await getID(username);
    const profileID = await getID(user);
    try {
        const sql =
            "SELECT Posts.*, Users.username, Users.profileImage, EXISTS (SELECT 1 FROM Liked_By WHERE Liked_By.postId = Posts.id AND Liked_By.userId = ?) AS isLiked, EXISTS (SELECT 1 FROM Saved_By WHERE Saved_By.postId = Posts.id AND Saved_By.userId = ?) AS isSaved, (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) as likes FROM Posts JOIN Users ON Users.id = Posts.userId WHERE Posts.userId = ? ORDER BY postedAt DESC";
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
            "SELECT Posts.*, Users.username, Users.profileImage, EXISTS (SELECT 1 FROM Liked_By WHERE Liked_By.postId = Posts.id AND Liked_By.userId = ?) AS isLiked, EXISTS (SELECT 1 FROM Saved_By WHERE Saved_By.postId = Posts.id AND Saved_By.userId = ?) AS isSaved, (SELECT COUNT(*) FROM Liked_By WHERE Liked_By.postId = Posts.id) as likes FROM Posts JOIN Users ON Users.id = Posts.userId WHERE Posts.id IN (SELECT postId FROM Saved_By WHERE userId = ?) ORDER BY postedAt DESC";
        const [result] = await pool.query(sql, [userID, userID, userID]);
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

export const addSave = async (username, postId) => {
    try {
        const userID = await getID(username);

        const sql = "INSERT INTO Saved_By (postId, userId) VALUES (?, ?)";
        const [result] = await pool.query(sql, [postId, userID]);
    } catch (err) {
        throw err;
    }
};

export const addLike = async (username, postId) => {
    try {
        const userID = await getID(username);

        const sql = "INSERT INTO Liked_By (postId, userId) VALUES (?, ?)";
        const [result] = await pool.query(sql, [postId, userID]);
    } catch (err) {
        throw err;
    }
};

export const deleteSave = async (username, postId) => {
    try {
        const userID = await getID(username);
        const sql = "DELETE FROM Saved_By WHERE postId = ? AND userId = ?";
        const [result] = await pool.query(sql, [postId, userID]);
    } catch (err) {
        throw err;
    }
};

export const deleteLike = async (username, postId) => {
    try {
        const userID = await getID(username);
        const sql = "DELETE FROM Liked_By WHERE postId = ? AND userId = ?";
        const [result] = await pool.query(sql, [postId, userID]);
    } catch (err) {
        throw err;
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
