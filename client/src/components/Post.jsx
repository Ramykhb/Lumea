import CommentSection from "./CommentSection.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookmark,
    faComment,
    faHeart,
} from "@fortawesome/free-regular-svg-icons";
import {
    faBookmark as faBookmarkSolid,
    faHeart as faHeartSolid,
    faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import LikeSection from "./LikeSection.jsx";
import { uploadsPath } from "@/config/imagesConfig.js";

const Post = (props) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [saved, setSaved] = useState(false);
    const [firstDivHeight, setFirstDivHeight] = useState(0);
    const [showLikes, setShowLikes] = useState(false);
    const [showComments, setShowComments] = useState(false);

    const [isMd, setIsMd] = useState(
        window.matchMedia("(min-width: 768px)").matches
    );

    const firstDivRef = useRef(null);
    const commentInput = useRef(null);

    const handleLike = async () => {
        try {
            if (liked) {
                const res = await api.delete("/posts/likePost", {
                    data: {
                        postId: props.id,
                    },
                });
                setLikes(likes - 1);
            } else {
                const res = await api.post("/posts/likePost", {
                    postId: props.id,
                    receiverUsername: props.username,
                });
                setLikes(likes + 1);
            }
            setLiked((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleSave = async () => {
        try {
            if (saved) {
                const res = await api.delete("/posts/savePost", {
                    data: { postId: props.id },
                });
            } else {
                const res = await api.post("/posts/savePost", {
                    postId: props.id,
                });
            }
            setSaved((prev) => !prev);
            if (props.onFilter) {
                props.onFilter(props.id);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleComment = () => {
        if (window.matchMedia("(min-width: 768px)").matches) {
            if (commentInput.current) {
                commentInput.current.focus();
            }
        } else {
            toggleShowComments();
        }
    };

    const toggleShowLikes = () => {
        setShowComments(false);
        setShowLikes(!showLikes);
    };

    const toggleShowComments = () => {
        setShowComments(!showComments);
        setShowLikes(false);
    };

    useEffect(() => {
        const el = firstDivRef.current;
        if (!el) return;

        setLikes(props.likes);
        setLiked(props.isLiked);
        setSaved(props.isSaved);

        const setHeight = () => {
            if (!showComments && el.offsetHeight > 0) {
                setFirstDivHeight(el.offsetHeight);
                if (window.matchMedia("(min-width: 768px)").matches) {
                    setShowComments(false);
                    setShowLikes(false);
                }
            }
        };

        const observer = new ResizeObserver(setHeight);
        observer.observe(el);

        const handleResize = () => {
            setHeight();
        };
        window.addEventListener("resize", handleResize);

        const images = el.querySelectorAll("img");
        images.forEach((img) => {
            if (!img.complete) img.addEventListener("load", setHeight);
        });

        setHeight();

        const mediaQuery = window.matchMedia("(min-width: 768px)");
        const handleChange = (e) => setIsMd(e.matches);
        mediaQuery.addEventListener("change", handleChange);

        return () => {
            mediaQuery.removeEventListener("change", handleChange);
            observer.disconnect();
            images.forEach((img) => img.removeEventListener("load", setHeight));
        };
    }, []);

    return (
        <div className="md:w-[60%] w-[80%] h-auto bg-primary-light dark:bg-primary-dark flex md:flex-row rounded-2xl border-gray-200 border-[1px] my-[2em] dark:border-border-dark flex-col items-start">
            <div
                ref={firstDivRef}
                className="md:w-[50%] w-full flex flex-col"
                style={
                    isMd
                        ? { display: "flex" }
                        : showComments || showLikes
                        ? { display: "none" }
                        : { display: "flex" }
                }
            >
                <Link
                    to={`/profile/${props.username}`}
                    className="flex items-center gap-3 p-2"
                >
                    <div className="w-10 h-10 md:w-7 md:h-7 lg:w-9 lg:h-9 rounded-full overflow-hidden">
                        <img
                            src={`${uploadsPath}${props.profileImage}`}
                            alt={props.username}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-sm font-semibold dark:text-gray-100">
                        {props.username}
                    </p>
                </Link>
                <img
                    src={`${uploadsPath}${props.postImage}`}
                    className="w-full h-auto"
                />
                <div className="w-full h-8 py-2 px-1 flex">
                    {liked ? (
                        <FontAwesomeIcon
                            icon={faHeartSolid}
                            onClick={handleLike}
                            className="text-red-500 mr-2 text-xl hover:cursor-pointer"
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faHeart}
                            onClick={handleLike}
                            className="text-black mr-2 text-xl hover:cursor-pointer dark:text-gray-100"
                        />
                    )}
                    <FontAwesomeIcon
                        icon={faComment}
                        onClick={handleComment}
                        className="text-black mr-2 text-xl hover:cursor-pointer dark:text-gray-100"
                    />
                    {saved ? (
                        <FontAwesomeIcon
                            icon={faBookmarkSolid}
                            onClick={handleSave}
                            className="text-black mr-2 text-xl hover:cursor-pointer dark:text-gray-100"
                        />
                    ) : (
                        <FontAwesomeIcon
                            icon={faBookmark}
                            onClick={handleSave}
                            className="text-black mr-2 text-xl hover:cursor-pointer dark:text-gray-100"
                        />
                    )}
                </div>
                <p
                    className="text-sm mt-2 ml-1 dark:text-gray-100 hover:cursor-pointer"
                    onClick={toggleShowLikes}
                >
                    {likes} likes
                </p>
                <div className="w-full pt-3 pb-2 px-1">
                    <p className="text-xs dark:text-gray-100">
                        {props.caption}
                    </p>
                    {props.isMe ? (
                        <div className="ml-auto flex mt-3 items-center justify-between">
                            <p className="text-[0.65rem] text-gray-400 dark:text-gray-500">
                                {new Date(props.postedAt).toLocaleDateString(
                                    "en-GB"
                                )}{" "}
                                at{" "}
                                {new Date(props.postedAt).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="text-red-500 mr-3 mb-2 hover:cursor-pointer"
                                onClick={() => props.onPostDeletion(props.id)}
                            />
                        </div>
                    ) : (
                        <p className="text-[0.65rem] text-gray-400 mt-3 dark:text-gray-500">
                            {new Date(props.postedAt).toLocaleDateString(
                                "en-GB"
                            )}{" "}
                            at{" "}
                            {new Date(props.postedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                            w
                        </p>
                    )}
                </div>
            </div>
            <CommentSection
                ref={commentInput}
                maxHeight={firstDivHeight}
                postId={props.id}
                showLikes={showLikes}
                showComments={showComments}
                onToggleShowComments={toggleShowComments}
                author={props.username}
            />
            <LikeSection
                maxHeight={firstDivHeight}
                postId={props.id}
                showLikes={showLikes}
                onToggleShowLikes={toggleShowLikes}
            />
            <div></div>
        </div>
    );
};

export default Post;
