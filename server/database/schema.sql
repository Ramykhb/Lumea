CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    username VARCHAR(40) UNIQUE,
    email VARCHAR(40) UNIQUE,
    password VARCHAR(60),
    profileImage VARCHAR(100),
    isPublic BOOLEAN
);

CREATE TABLE Posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    postImage VARCHAR(100),
    caption VARCHAR(255),
    postedAt DATETIME,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Followed_By (
    followerId INT,
    followingId INT,
    PRIMARY KEY (followerId, followingId),
    FOREIGN KEY (followerId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (followingId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Liked_By (
    postId INT,
    userId INT,
    PRIMARY KEY (postId, userId),
    FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Saved_By (
    postId INT,
    userId INT,
    PRIMARY KEY (postId, userId),
    FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Commented_By (
    id INT AUTO_INCREMENT PRIMARY KEY,
    postId INT,
    userId INT,
    content VARCHAR(255),
    commentedAt DATETIME,
    FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Refresh_Tokens (
    token VARCHAR(500) PRIMARY KEY,
    userId INT,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);