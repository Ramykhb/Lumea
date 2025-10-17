import { useEffect, useState } from "react";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import Post from "../components/Post";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";

const Profile = (props) => {
    const { username } = useParams();
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState({});
    const [followerCount, setFollowerCount] = useState();
    const navigate = useNavigate();

    const handlePostDeletion = async (id) => {
        try {
            const res = await api.delete("/posts/deletePost", {
                data: { postId: id },
            });
            setPosts(posts.filter((post) => post.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/auth/profile/${username}`);
                setProfile(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await api.get(`/posts/getposts/${username}`);
                setPosts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        setFollowerCount(profile.followerCount);
        if (profile.isPublic || profile.isFollowed || profile.isMe) {
            fetchPosts();
        }
    }, [profile]);

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar onUser={props.onUser} username={props.username} />
            <div className="w-[80%] ml-[20%] min-h-[100vh] flex flex-col items-center overflow-y-auto">
                <div className="h-auto w-[60%] flex">
                    <div className="w-[40%] h-full flex items-center">
                        <div className="relative ml-10 w-[10em] h-[10em] rounded-full p-[3px] bg-gradient-to-r from-yellow-400 to-orange-500">
                            <div className="w-full h-full rounded-full bg-primary-light dark:bg-primary-dark p-[4px]">
                                <img
                                    src={`http://localhost:3000${profile.profileImage}`}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-[60%] h-full flex flex-col py-10">
                        <div className="flex mb-2 justify-between">
                            <h2 className="text-xl dark:text-gray-100">
                                {profile.username}
                            </h2>

                            {profile.isMe ? (
                                <button
                                    className=" w-24 h-8 rounded-md bg-yellow-400 text-sm hover:bg-yellow-500 mr-20"
                                    onClick={() => {
                                        navigate("/editProfile");
                                    }}
                                >
                                    Edit Profile
                                </button>
                            ) : profile.isPublic || profile.isFollowed ? (
                                profile.isFollowed ? (
                                    <button className="w-16 h-8 rounded-md bg-yellow-400 text-sm hover:bg-yellow-500 mr-20">
                                        Unfollow
                                    </button>
                                ) : (
                                    <button className="w-16 h-8 rounded-md bg-yellow-400 text-sm hover:bg-yellow-500 mr-20">
                                        Follow
                                    </button>
                                )
                            ) : (
                                <></>
                            )}
                        </div>
                        <h2 className="text-sm font-bold dark:text-gray-100 mb-5">
                            {profile.name}
                        </h2>
                        <div className="flex mb-5">
                            <h2 className="text-lg mr-5 text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-black dark:text-gray-100">
                                    {profile.postCount}{" "}
                                </span>
                                posts
                            </h2>
                            <h2 className="text-lg mr-5 text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-black dark:text-gray-100">
                                    {followerCount}{" "}
                                </span>
                                followers
                            </h2>
                            <h2 className="text-lg mr-5 text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-black dark:text-gray-100">
                                    {profile.followingCount}{" "}
                                </span>
                                following
                            </h2>
                        </div>
                        <h2 className="text-xs dark:text-gray-100">
                            {profile.bio}
                        </h2>
                    </div>
                </div>
                <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                {posts.length > 0 ? (
                    <h1 className="text-center text-xl mt-10">Latest Posts</h1>
                ) : (
                    ""
                )}
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
                                isMe={profile.isMe}
                                onPostDeletion={handlePostDeletion}
                            />
                            <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                        </React.Fragment>
                    ))
                ) : (
                    <div className="h-[50vh] flex items-center justify-center">
                        <h1 className="text-lg dark:text-gray-300 text-gray-800">
                            {profile.isPublic || profile.isMe
                                ? "No posts available."
                                : "The following profile is private."}
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
