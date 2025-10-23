import { useEffect, useState } from "react";
import Post from "../components/Post";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import React from "react";

const Homepage = (props) => {
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
                    return (
                        post.isFollowed ||
                        post.isPublic ||
                        post.username === props.username
                    );
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
    }, [props.username]);

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
            <SideBar username={props.username} />
            <div className="md:w-[80%] w-[85%] md:ml-[20%] ml-[15%] min-h-[100vh] flex flex-col items-center overflow-y-auto">
                <div className="h-10 flex flex-row justify-center items-center w-full py-5 mt-5">
                    <div className="flex justify-between xl:w-[20%] w-[60%]">
                        <p
                            className={
                                allPosts
                                    ? "hover:cursor-pointer hover:underline sm:text-lg text-xs text-black dark:text-white font-bold"
                                    : "hover:cursor-pointer hover:underline sm:text-lg text-xs text-[#474645] dark:text-[#757574]"
                            }
                            onClick={turnOnAllPosts}
                        >
                            All Posts
                        </p>
                        <p
                            className={
                                !allPosts
                                    ? "hover:cursor-pointer hover:underline sm:text-lg text-xs text-black dark:text-white font-bold"
                                    : "hover:cursor-pointer hover:underline sm:text-lg text-xs text-[#474645] dark:text-[#757574]"
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
            </div>
        </div>
    );
};

export default Homepage;
