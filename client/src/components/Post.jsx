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
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const Post = (props) => {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(0);
    const [saved, setSaved] = useState(false);
    const [firstDivHeight, setFirstDivHeight] = useState(0);

    const firstDivRef = useRef(null);
    const commentInput = useRef(null);

    const handleLike = async () => {
        try {
            if (liked) {
                const res = await api.delete("/posts/likePost", {
                    data: { postId: props.id },
                });
                setLikes(likes - 1);
            } else {
                const res = await api.post("/posts/likePost", {
                    postId: props.id,
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
        if (commentInput.current) {
            commentInput.current.focus();
        }
    };

    useEffect(() => {
        const el = firstDivRef.current;
        if (!el) return;

        setLikes(props.likes);
        setLiked(props.isLiked);
        setSaved(props.isSaved);

        const setHeight = () => setFirstDivHeight(el.offsetHeight);

        const observer = new ResizeObserver(setHeight);
        observer.observe(el);

        const images = el.querySelectorAll("img");
        images.forEach((img) => {
            if (!img.complete) img.addEventListener("load", setHeight);
        });

        setHeight();

        return () => {
            observer.disconnect();
            images.forEach((img) => img.removeEventListener("load", setHeight));
        };
    }, []);

    return (
        <div className="w-[60%] h-auto bg-primary-light dark:bg-primary-dark flex flex-row rounded-2xl border-gray-200 border-[1px] my-[2em] dark:border-border-dark">
            <div ref={firstDivRef} className="w-[50%] flex flex-col">
                <Link to={`/profile/${props.username}`}>
                    <div className="w-full  h-15 flex py-3 px-3 items-center justify-start">
                        <img
                            src={`http://localhost:3000${props.profileImage}`}
                            className="w-7 h-auto rounded-full mr-3"
                        />
                        <p className="text-sm font-semibold dark:text-gray-100">
                            {props.username}
                        </p>
                    </div>
                </Link>
                <img
                    src={`http://localhost:3000${props.postImage}`}
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
                <p className="text-sm mt-2 ml-1 dark:text-gray-100">
                    {likes} likes
                </p>
                <div className="w-full pt-3 pb-2 px-1">
                    <p className="text-xs dark:text-gray-100">
                        {props.caption}
                    </p>
                    <p className="text-[0.65rem] text-gray-400 mt-3 dark:text-gray-500">
                        {props.postedAt.split("T")[0]} at{" "}
                        {props.postedAt.split("T")[1].split(":")[0]}:
                        {props.postedAt.split("T")[1].split(":")[1]}
                    </p>
                </div>
            </div>
            <CommentSection
                ref={commentInput}
                maxHeight={firstDivHeight}
                postId={props.id}
            />
        </div>
    );
};

export default Post;
