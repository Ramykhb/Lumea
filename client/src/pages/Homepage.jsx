import { useEffect, useRef, useState } from "react";
import Post from "../components/Post";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import React from "react";

const Homepage = (props) => {
    const limit = 5;
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    const fetchPosts = async (newPage = page) => {
        if (!isLoading) {
            try {
                setIsLoading(true);
                const res = await api.get("/posts", {
                    params: {
                        allPosts: allPosts,
                        page: newPage,
                        limit: limit,
                        userId: props.userId,
                    },
                });

                if (res.data.posts.length > 0) {
                    if (newPage == 1) {
                        setPosts(res.data.posts);
                    } else {
                        setPosts((prev) => [...prev, ...res.data.posts]);
                    }
                }
                if (!res.data.hasMore) setHasMore(false);
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (page > 1) fetchPosts();
    }, [page]);

    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
        fetchPosts(1);
    }, [allPosts]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isLoading &&
                    posts.length > 0
                ) {
                    setPage((prev) => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        const currentLoader = loader.current;
        if (currentLoader) observer.observe(currentLoader);

        return () => {
            if (currentLoader) observer.unobserve(currentLoader);
        };
    }, [hasMore, isLoading]);

    const turnOnAllPosts = () => {
        setAllPosts(true);
    };

    const turnOffAllPosts = () => {
        setAllPosts(false);
    };
    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar username={props.username} userId={props.userId} />
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
                                userID={props.userId}
                                posterID={post.posterID}
                            />
                            <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                        </React.Fragment>
                    ))
                ) : (
                    <div className="h-[90vh] flex flex-col items-center justify-center w-full">
                        {isLoading ? (
                            <>
                                <img
                                    src="/spinner.svg"
                                    className="w-[25%] mx-auto mb-2"
                                />
                                <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                                    Loading available posts.
                                </h1>
                            </>
                        ) : (
                            <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                                No posts available
                            </h1>
                        )}
                    </div>
                )}
                {hasMore ? (
                    <div ref={loader} className="w-full">
                        <img
                            src="/spinner.svg"
                            className="md:w-[5%] w-[15%] mx-auto mb-2"
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
};

export default Homepage;
