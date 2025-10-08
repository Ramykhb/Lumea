import { useEffect, useState } from "react";
import Post from "../components/Post";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import React from "react";

const Homepage = () => {
    const [posts, setposts] = useState([]);
    const [allPosts, setAllPosts] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get("/posts");
                setposts(res.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            let path;
            if (allPosts) {
                path = "/posts";
            } else {
                path = "/posts/following";
            }
            try {
                const res = await api.get(path);
                setposts(res.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        };

        fetchPosts();
    }, [allPosts]);

    const turnOnAllPosts = () => {
        setAllPosts(true);
    };

    const turnOffAllPosts = () => {
        setAllPosts(false);
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar />
            <div className="w-[80%] h-[90em] ml-[20%] flex flex-col items-center overflow-y-auto">
                <div className="h-10 flex flex-row justify-center items-center w-full py-5 mt-5">
                    <div className="flex justify-between w-[20%]">
                        <p
                            className={
                                allPosts
                                    ? "hover:cursor-pointer hover:underline text-lg text-black dark:text-white font-bold"
                                    : "hover:cursor-pointer hover:underline text-lg text-[#474645] dark:text-[#757574]"
                            }
                            onClick={turnOnAllPosts}
                        >
                            All Posts
                        </p>
                        <p
                            className={
                                !allPosts
                                    ? "hover:cursor-pointer hover:underline text-lg text-black dark:text-white font-bold"
                                    : "hover:cursor-pointer hover:underline text-lg text-[#474645] dark:text-[#757574]"
                            }
                            onClick={turnOffAllPosts}
                        >
                            My Following
                        </p>
                    </div>
                </div>
                {posts.map((post) => (
                    <React.Fragment key={post.id}>
                        <Post
                            id={post.id}
                            caption={post.caption}
                            postedAt={post.postedAt}
                            username={post.username}
                            postImage={post.postImage}
                            profileImage={post.profileImage}
                        />
                        <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Homepage;
