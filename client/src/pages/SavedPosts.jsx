import { useEffect, useState } from "react";
import Post from "../components/Post";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import React from "react";

const SavedPosts = (props) => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPosts = async () => {
        if (!isLoading) {
            try {
                setIsLoading(true);
                const res = await api.get("/posts/saved");
                setPosts(res.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const filterPosts = (ID) => {
        setPosts(posts.filter((post) => post.id !== ID));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar username={props.username} userId={props.userId} />
            <div className="md:w-[80%] w-[85%] md:ml-[20%] ml-[15%] min-h-[100vh] flex flex-col items-center overflow-y-auto">
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
                                likes={post.likes}
                                isLiked={post.isLiked}
                                isSaved={post.isSaved}
                                posterID={post.posterID}
                                userID={props.userId}
                                onFilter={filterPosts}
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
                                    Fetching saved posts.
                                </h1>
                            </>
                        ) : (
                            <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                                No saved posts found.
                            </h1>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedPosts;
