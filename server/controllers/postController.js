import { retrieveAllPosts } from "../services/postService.js";

export const getAllPosts = async (req, res) => {
    const posts = await retrieveAllPosts();
    console.log(posts);
    if (!posts) {
        return res.status(400).json({
            title: "Invalid Request",
            message: "The request data is not valid. Please check your input.",
        });
    }
    res.json(posts);
};
