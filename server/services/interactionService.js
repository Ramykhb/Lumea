import pool from "../database/dbConfig.js";
import { getID } from "./authService.js";

export async function followUser(userID, profileID) {
    try {
        const sql = "INSERT INTO Followed_By VALUES (?,?)";
        const [result] = await pool.query(sql, [userID, profileID]);
    } catch (err) {
        throw err;
    }
}

export async function unfollowUser(myusername, username) {
    const userID = await getID(myusername);
    const profileID = await getID(username);
    try {
        const sql =
            "DELETE FROM Followed_By WHERE followerId = ? AND followingId = ?";
        const [result] = await pool.query(sql, [userID, profileID]);
    } catch (err) {
        throw err;
    }
}

export async function retrieveFollowers(username) {
    const userID = await getID(username);
    try {
        const sql =
            "SELECT username, profileImage FROM Users WHERE id IN (SELECT followerId FROM Followed_By WHERE followingId = ?)";
        const [result] = await pool.query(sql, [userID]);
        return result;
    } catch (err) {
        throw err;
    }
}

export async function retrieveFollowing(username) {
    const userID = await getID(username);
    try {
        const sql =
            "SELECT username, profileImage FROM Users WHERE id IN (SELECT followingId FROM Followed_By WHERE followerId = ?)";
        const [result] = await pool.query(sql, [userID]);
        return result;
    } catch (err) {
        throw err;
    }
}

export const retrieveComments = async (postId, username) => {
    const userID = await getID(username);
    try {
        const sql =
            "SELECT Commented_By.*, Users.username AS posted_by, Users.profileImage AS profileImage, IF(Commented_By.userId = ?, 1, 0) AS isMe FROM Commented_By JOIN Users ON Users.id = Commented_By.userId WHERE postId = ? ORDER BY commentedAt DESC";
        const [result] = await pool.query(sql, [userID, postId]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const retrieveLikes = async (postId) => {
    try {
        const sql =
            "SELECT Liked_By.*, Users.username AS posted_by, Users.profileImage AS profileImage FROM Liked_By JOIN Users ON Users.id = Liked_By.userId WHERE postId = ? ORDER BY Users.username ASC";
        const [result] = await pool.query(sql, [postId]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const retrieveNotifications = async (username) => {
    const userID = await getID(username);
    try {
        const sql =
            "SELECT Notifications.*, Users.username, Users.profileImage FROM Notifications JOIN Users ON Users.id = Notifications.senderId WHERE receiverId = ? ORDER BY sentAt DESC";
        const [result] = await pool.query(sql, [userID]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const isNewNotifications = async (username) => {
    const userID = await getID(username);
    try {
        const sql =
            "SELECT COUNT(*) as newCount FROM Notifications WHERE receiverId = ? AND isDelivered = false";
        const [result] = await pool.query(sql, [userID]);
        return result[0];
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const addNotification = async (senderId, receiverId, type) => {
    try {
        const sql =
            "INSERT INTO Notifications (senderId, receiverId, type) VALUES (?,?,?)";
        const [result] = await pool.query(sql, [senderId, receiverId, type]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const updateNotifications = async (username) => {
    const userID = await getID(username);
    try {
        const sql =
            "UPDATE Notifications SET isDelivered = true WHERE receiverId = ?";
        const [result] = await pool.query(sql, [userID]);
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const deleteOldNotifications = async (userId) => {
    try {
        const sql =
            "DELETE FROM Notifications WHERE sentAt < NOW() - INTERVAL 3 DAY AND isDelivered = true AND receiverId = ?";
        const [result] = await pool.query(sql, [userId]);
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

export const deleteComment = async (commentId) => {
    try {
        const sql = "DELETE FROM Commented_By WHERE id = ?";
        const [result] = await pool.query(sql, [commentId]);
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getCommentAuthor = async (commentId) => {
    try {
        const sql = "SELECT userId FROM Commented_By WHERE id = ?";
        const [result] = await pool.query(sql, [commentId]);
        return result;
    } catch (err) {
        throw err;
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
