import pool from "../database/dbConfig.js";

export const retrieveMessages = async (primaryId, secondaryId) => {
    try {
        const sql =
            "SELECT * from Messages WHERE receiverId = ? AND senderId = ? AND isDelivered = False ORDER BY sentAt ASC";
        const [result] = await pool.query(sql, [primaryId, secondaryId]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const updateMessages = async (primaryId, secondaryId) => {
    try {
        const sql =
            "DELETE FROM Messages WHERE receiverId = ? AND senderId = ?";
        const [result] = await pool.query(sql, [primaryId, secondaryId]);
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const insertMessage = async (senderID, receiverID, content) => {
    try {
        const sql =
            "INSERT INTO Messages (senderId, receiverId, content) VALUES (?,?,?)";
        const [result] = await pool.query(sql, [senderID, receiverID, content]);
        return {
            insertId: result.insertId,
            senderId: senderID,
            receiverId: receiverID,
        };
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const deleteMessage = async (messageId) => {
    try {
        const sql = "DELETE FROM Messages WHERE id = ?";
        const [result] = await pool.query(sql, [messageId]);
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};
