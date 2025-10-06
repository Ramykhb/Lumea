import pool from "../database/dbConfig.js";

export const retrieveAllPosts = async () => {
    try {
        const sql =
            "SELECT Posts.*, Users.username, Users.profileImage FROM Posts JOIN Users ON Users.id = Posts.userId";
        const [result] = await pool.query(sql);
        return result;
    } catch (err) {
        console.error("Error Querying Database:", err);
    }
};
