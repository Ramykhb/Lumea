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
        throw err;
    }
}

export async function updatePassword(username, currentPass, newPass) {
    const userID = await getID(username);
    try {
        const sql = "SELECT password FROM Users WHERE id = ?";
        const [result] = await pool.query(sql, [userID]);
        const match = await verifyPassword(currentPass, result[0].password);
        if (!match) {
            return false;
        }
    } catch (err) {
        throw err;
    }
    const newPassHash = await hashPassword(newPass);

    try {
        const sql = "UPDATE Users SET password = ? WHERE id = ?";
        const [result] = await pool.query(sql, [newPassHash, userID]);
        return true;
    } catch (err) {
        throw err;
    }
}

export async function getID(username) {
    try {
        const sql = "SELECT id FROM Users WHERE username = ?";
        const [result] = await pool.query(sql, [username]);
        if (result.length === 0) {
            throw new Error(`User with username "${username}" not found`);
        }
        return result[0].id;
    } catch (err) {
        throw err;
    }
}

export async function getPassword(username) {
    try {
        const sql = "SELECT password FROM Users WHERE username = ?";
        const [result] = await pool.query(sql, [username]);
        if (result.length == 0) return null;
        return result[0].password;
    } catch (err) {
        throw err;
    }
}

export async function tokenExists(refreshToken) {
    try {
        const sql =
            "SELECT COUNT(*) AS count FROM Refresh_Tokens WHERE token = ?";
        const [result] = await pool.query(sql, [refreshToken]);
        return result[0].count > 0;
    } catch (err) {
        throw err;
    }
}

export async function editUser(
    { isPublic, bio, name, profileImage },
    username
) {
    const userID = await getID(username);
    try {
        const sql =
            "UPDATE Users SET bio = ?, name = ?, profileImage = ?, isPublic = ? WHERE id = ?";
        const [result] = await pool.query(sql, [
            bio,
            name,
            profileImage,
            isPublic,
            userID,
        ]);
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

export async function followUser(myusername, username) {
    const userID = await getID(myusername);
    const profileID = await getID(username);
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

export async function fetchProfile(username, loggedInUsername) {
    const userID = await getID(loggedInUsername);
    try {
        const sql = `SELECT id, bio, name, username, profileImage, isPublic, (SELECT COUNT(*) FROM Posts WHERE userId = Users.id) AS postCount, (SELECT COUNT(*) FROM Followed_By WHERE followingId = Users.id) AS followerCount, (SELECT COUNT(*) FROM Followed_By WHERE followerId = Users.id) AS followingCount, EXISTS (SELECT 1 FROM Followed_By WHERE followerId = ? AND followingId = Users.id) AS isFollowed FROM Users WHERE username = ?`;
        const [result] = await pool.query(sql, [userID, username]);
        if (result.length > 0) {
            const newRes = {
                ...result[0],
                isMe: username === loggedInUsername,
            };
            return newRes;
        }
        throw new Error();
    } catch (err) {
        throw err;
    }
}

export async function fetchProfiles(searchVal) {
    try {
        const sql = `SELECT id, username, profileImage FROM Users WHERE username LIKE ?`;
        const [result] = await pool.query(sql, [`%${searchVal}%`]);
        if (result.length > 0) {
            return result;
        }
        throw new Error();
    } catch (err) {
        throw err;
    }
}

export async function emailExists(email) {
    try {
        const sql = "SELECT COUNT(*) AS count FROM Users WHERE email = ?";
        const [result] = await pool.query(sql, [email]);
        return result[0].count > 0;
    } catch (err) {
        throw err;
    }
}

export async function insertToken(username, refreshToken) {
    const userID = await getID(username);
    try {
        const sql = "INSERT INTO Refresh_Tokens VALUES (?,?)";
        const [result] = await pool.query(sql, [refreshToken, userID]);
        return true;
    } catch (err) {
        throw err;
    }
}

export async function addUser({ username, name, email, password }) {
    username = username.toLowerCase();
    const hashedPassword = await hashPassword(password);
    try {
        const sql =
            "INSERT INTO Users (name, username, email, password, profileImage, isPublic) VALUES (?,?,?,?,?, TRUE)";
        const [result] = await pool.query(sql, [
            name,
            username,
            email,
            hashedPassword,
            "/uploads/avatar.svg",
        ]);
        return result;
    } catch (err) {
        throw err;
    }
}

export const deleteRefreshTokenFromDB = async (
    refreshToken,
    username = null
) => {
    let sql = "DELETE FROM Refresh_Tokens WHERE token = ?";
    let temp = [refreshToken];
    if (username) {
        let userID = await getID(username);
        sql = "DELETE FROM Refresh_Tokens WHERE userId = ?";
        let temp = [userID];
    }
    try {
        const [result] = await pool.query(sql, temp);
    } catch (err) {
        throw err;
    }
};

export const deleteUser = async (username) => {
    const userID = await getID(username);
    try {
        const sql = "DELETE FROM Users WHERE id = ?";
        const [result] = await pool.query(sql, [userID]);
    } catch (err) {
        throw err;
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
