import { useEffect, useState } from "react";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import Post from "../components/Post";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import FollowSection from "@/components/FollowSection";
import { uploadsPath } from "@/config/imagesConfig";

const Profile = (props) => {
    const { username } = useParams();
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState({});
    const [followerCount, setFollowerCount] = useState();
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowings, setShowFollowings] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    const toggleShowFollowers = () => {
        setShowFollowings(false);
        setShowFollowers(!showFollowers);
    };

    const toggleShowFollowings = () => {
        setShowFollowers(false);
        setShowFollowings(!showFollowings);
    };

    const fetchProfile = async () => {
        if (!isLoading) {
            try {
                setIsLoading(true);
                const res = await api.get(`/auth/profile/${username}`);
                setProfile(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleFollowProfile = async () => {
        try {
            const res = await api.post("/auth/follow", {
                username: profile.username,
                senderId: props.userId,
                receiverId: profile.id,
            });
            setProfile({
                ...profile,
                isFollowed: true,
                followerCount: profile.followerCount + 1,
            });
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnfollowProfile = async () => {
        try {
            const res = await api.delete("/auth/follow", {
                data: {
                    username: profile.username,
                },
            });
            fetchProfile();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setPosts([]);
        setFollowerCount(0);
        setShowFollowers(false);
        setShowFollowings(false);
        fetchProfile();
    }, []);

    useEffect(() => {
        setPosts([]);
        setFollowerCount(0);
        setShowFollowers(false);
        setShowFollowings(false);
        fetchProfile();
    }, [username]);

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
            <SideBar username={props.username} userId={props.userId} />
            <div
                className="md:w-[80%] w-[85%] md:ml-[20%] ml-[15%] min-h-[100vh] flex flex-col items-center overflow-y-auto"
                style={
                    showFollowers || showFollowings
                        ? { overflowY: "hidden" }
                        : { overflowY: "auto" }
                }
            >
                <div className="h-auto lg:w-[60%] md:w-[80%] w-[90%] flex">
                    <div className="w-[40%] mr-1 md:mr-0 h-full flex items-center">
                        <div className="relative md:ml-10 xs:ml-5 sm:ml-7 w-[5em] h-[5em] sm:w-[7em] sm:h-[7em] lg:w-[10em] lg:h-[10em] md:w-[8em] md:h-[8em] rounded-full p-[3px] bg-gradient-to-r from-yellow-400 to-orange-500">
                            <div className="w-full h-full rounded-full bg-primary-light dark:bg-primary-dark p-[4px]">
                                <img
                                    src={
                                        profile.profileImage
                                            ? `${uploadsPath}${profile.profileImage}`
                                            : `${uploadsPath}/uploads/avatar.svg`
                                    }
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-[60%] h-full flex flex-col py-10">
                        <div className="flex md:mb-2 mb-1 justify-between items-center">
                            <h2 className="md:text-xl text-sm dark:text-gray-100">
                                {profile.username}
                            </h2>

                            {profile.isMe ? (
                                <button
                                    className="xs:p-2 p-1 text-nowrap rounded-md bg-yellow-400 md:text-sm hover:bg-yellow-500 ml-auto text-xs"
                                    onClick={() => {
                                        navigate("/editProfile");
                                    }}
                                >
                                    Edit Profile
                                </button>
                            ) : profile.isPublic || profile.isFollowed ? (
                                profile.isFollowed ? (
                                    <div className="flex items-center justify-center">
                                        <div className="flex mr-5 dark:text-white">
                                            <FontAwesomeIcon
                                                icon={faMessage}
                                                className="dark:text-white text-xl hover:cursor-pointer"
                                                onClick={() => {
                                                    navigate(
                                                        `/chat/${profile.username}`
                                                    );
                                                }}
                                            />
                                        </div>
                                        <button
                                            className="p-2 rounded-md bg-yellow-400 md:text-sm text-xs hover:bg-yellow-500"
                                            onClick={handleUnfollowProfile}
                                        >
                                            Unfollow
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <div className="flex mr-5 dark:text-white">
                                            <FontAwesomeIcon
                                                icon={faMessage}
                                                className="dark:text-white text-xl hover:cursor-pointer"
                                                onClick={() => {
                                                    navigate(
                                                        `/chat/${profile.username}`
                                                    );
                                                }}
                                            />
                                        </div>
                                        <button
                                            className="p-2 rounded-md bg-yellow-400 md:text-sm text-xs hover:bg-yellow-500"
                                            onClick={handleFollowProfile}
                                        >
                                            Follow
                                        </button>
                                    </div>
                                )
                            ) : (
                                <></>
                            )}
                        </div>
                        <h2 className="text-sm font-bold dark:text-gray-100 md:mb-5 mb-2">
                            {profile.name}
                        </h2>
                        <div className="flex mb-5">
                            <h2 className="md:text-lg text-xs mr-5 text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-black dark:text-gray-100">
                                    {profile.postCount}{" "}
                                </span>
                                posts
                            </h2>
                            <h2
                                className="md:text-lg text-xs mr-5 text-gray-600 dark:text-gray-400 hover:cursor-pointer"
                                onClick={toggleShowFollowers}
                            >
                                <span className="font-bold text-black dark:text-gray-100">
                                    {followerCount}{" "}
                                </span>
                                followers
                            </h2>
                            <h2
                                className="md:text-lg text-xs mr-5 text-gray-600 dark:text-gray-400 hover:cursor-pointer"
                                onClick={toggleShowFollowings}
                            >
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
                <div
                    className="w-[80%] h-[100vh] ml-[20%] hidden flex-col items-center justify-center backdrop-blur-md bg-white/30 p-4 rounded-lg absolute top-0 left-0 z-40"
                    style={{
                        display:
                            showFollowers || showFollowings ? "flex" : "none",
                    }}
                >
                    <FollowSection
                        showFollowers={showFollowers}
                        showFollowings={showFollowings}
                        onToggleFollowers={toggleShowFollowers}
                        onToggleFollowings={toggleShowFollowings}
                        username={profile.username}
                    />
                </div>
                <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                {posts.length > 0 ? (
                    <h1 className="text-center text-xl mt-10 dark:text-gray-100">
                        Latest Posts
                    </h1>
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
                                userID={props.userId}
                                posterID={post.posterID}
                                isMe={profile.isMe}
                                onPostDeletion={handlePostDeletion}
                            />
                            <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                        </React.Fragment>
                    ))
                ) : (
                    <div className="h-[50vh] flex flex-col items-center justify-center">
                        {isLoading ? (
                            <>
                                <img
                                    src="/spinner.svg"
                                    className="w-[25%] mx-auto mb-2"
                                />
                                <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                                    Fetching profile.
                                </h1>
                            </>
                        ) : (
                            <h1 className="text-lg dark:text-gray-300 text-gray-800">
                                {profile.isPublic || profile.isMe
                                    ? "No posts available."
                                    : "The following profile is private."}
                            </h1>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
