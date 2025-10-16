import { useEffect, useState } from "react";
import Post from "../components/Post";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import React from "react";
import ClickSpark from "@/components/ClickSpark";

const Homepage = () => {
    const [posts, setposts] = useState([]);
    const [allPosts, setAllPosts] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await api.get("/posts", {
                params: {
                    allPosts: allPosts,
                },
            });
            setposts(
                res.data.filter((post) => {
                    return post.isFollowed || post.isPublic;
                })
            );
        } catch (err) {
            console.error("Error fetching posts:", err);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
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
            <div className="w-[80%] ml-[20%] min-h-[100vh] flex flex-col items-center overflow-y-auto">
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
                                likes={post.likes}
                                isLiked={post.isLiked}
                                isSaved={post.isSaved}
                            />
                            <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                        </React.Fragment>
                    ))
                ) : (
                    <div className="h-[90vh] flex items-center justify-center">
                        <h1 className="text-lg dark:text-gray-300 text-gray-800">
                            No posts available
                        </h1>
                    </div>
                )}
                <ClickSpark
                    sparkColor="#000"
                    sparkSize={10}
                    sparkRadius={15}
                    sparkCount={8}
                    duration={400}
                >
                    <div>TEST</div>
                </ClickSpark>
            </div>
        </div>
    );
};

export default Homepage;
