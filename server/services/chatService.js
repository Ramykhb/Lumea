import pool from "../database/dbConfig.js";
import { getID } from "./userService.js";

export const retrieveMessages = async (primUsername, secUsername) => {
    const primaryID = await getID(primUsername);
    const secondaryID = await getID(secUsername);
    try {
        const sql =
            "SELECT * from Messages WHERE receiverId = ? AND senderId = ? AND isDelivered = False ORDER BY sentAt ASC";
        const [result] = await pool.query(sql, [primaryID, secondaryID]);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const updateMessages = async (primUsername, secUsername) => {
    const primaryID = await getID(primUsername);
    const secondaryID = await getID(secUsername);
    try {
        const sql =
            "DELETE FROM Messages WHERE receiverId = ? AND senderId = ?";
        const [result] = await pool.query(sql, [primaryID, secondaryID]);
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};

export const insertMessage = async (sender, receiver, content) => {
    const senderID = await getID(sender);
    const receiverID = await getID(receiver);
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
