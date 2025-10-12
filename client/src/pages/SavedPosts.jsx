import { useEffect, useState } from "react";
import Post from "../components/Post";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import React from "react";

const SavedPosts = () => {
    const [posts, setposts] = useState([]);

    const fetchPosts = async () => {
        try {
            const res = await api.get("/posts/saved");
            setposts(res.data);
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar />
            <div className="w-[80%] ml-[20%] min-h-[100vh] flex flex-col items-center overflow-y-auto">
                <div className="h-[14vh] flex flex-row justify-center items-center w-full">
                    <h1 className="text-2xl font-bold dark:text-gray-100">
                        Saved Posts
                    </h1>
                </div>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <React.Fragment key={post.id}>
                            <Post
                                id={post.id}
                                caption={post.caption}
                                postedAt={post.postedAt}
                                username={post.username}
                                postImage={post.postImage}
                                profileImage={post.profileImage}
                                isSaved={post.isSaved}
                            />
                            <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                        </React.Fragment>
                    ))
                ) : (
                    <div className="h-[90vh] flex items-center justify-center">
                        <h1 className="text-lg dark:text-gray-300 text-gray-800">
                            No saved posts available
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedPosts;
