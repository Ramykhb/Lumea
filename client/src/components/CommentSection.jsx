import React, { forwardRef, useEffect, useState } from "react";
import api from "../api/axios";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { backendPath } from "@/config/backConfig";

const CommentSection = forwardRef((props, ref) => {
    const [comments, setComments] = useState([]);
    const [postButton, setPostButton] = useState(
        "md:text-base text-blue-200 dark:text-blue-200 text-xs md:mr-0 mr-5"
    );
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const getComments = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/interactions/comments", {
                params: {
                    postId: props.postId,
                },
            });
            const comments = res.data;
            setComments(comments);
        } catch (error) {
            console.log("Error getting comments");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getComments();
    }, []);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
        if (e.target.value.length == 0) {
            setPostButton(
                "text-xs md:text-base text-blue-200 dark:text-blue-200 md:mr-0 mr-5"
            );
        } else {
            setPostButton(
                "hover:cursor-pointer md:text-base text-xs text-blue-600 md:mr-0 mr-5"
            );
        }
    };

    const handleCommentDeletion = async (id) => {
        if (!isLoading) {
            try {
                setIsLoading(true);
                const res = await api.delete("/interactions/delete-comment", {
                    data: { commentId: id },
                });
                setComments(comments.filter((comment) => comment.id !== id));
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCommentPost = async (e) => {
        e.preventDefault();
        if (!isLoading) {
            try {
                setIsLoading(true);
                setComments([
                    {
                        content: newComment,
                        profileImage:
                            "https://jwpfsgqlmssdrfogfasp.supabase.co/storage/v1/object/public/Lumea%20Uploads/avatar.svg",
                        posted_by: props.loggedinUser,
                        commentedAt: new Date(),
                    },
                    ...comments,
                ]);
                const res = await api.post("/interactions/comment", {
                    postId: props.postId,
                    content: newComment,
                });
                setComments((prevComments) => prevComments.slice(0, -1));
                setComments([res.data.newComment, ...comments]);
                setNewComment("");
                setPostButton("text-base text-blue-200");
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div
            className="md:w-[50%] w-full relative flex-col border-gray-200 dark:border-border-dark md:border-t-0 hidden md:flex"
            style={{
                height: props.maxHeight ? `${props.maxHeight}px` : "auto",
                display: props.showLikes
                    ? "none"
                    : window.matchMedia("(min-width: 768px)").matches
                    ? "flex"
                    : props.showComments
                    ? "flex"
                    : "none",
            }}
        >
            <div
                style={{
                    height: props.maxHeight
                        ? `${props.maxHeight - 40}px`
                        : "auto",
                }}
                className="w-full bg-primary-light dark:bg-primary-dark flex flex-col overflow-y-auto rounded-tr-2xl  border-gray-200 dark:border-border-dark"
            >
                <div className="w-full sticky left-0 top-0 flex py-2 items-center border-b-[1px] border-gray-300 dark:border-border-dark bg-primary-light dark:bg-primary-dark justify-between">
                    <FontAwesomeIcon
                        icon={faClose}
                        className="text-white ml-3 opacity-0"
                    />
                    <p className="text-sm font-semibold dark:text-gray-100 py-1">
                        Comments
                    </p>
                    <FontAwesomeIcon
                        icon={faClose}
                        className="dark:text-white mr-3 hover:cursor-pointer md:opacity-0"
                        onClick={props.onToggleShowComments}
                    />
                </div>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <React.Fragment key={comment.id}>
                            <div className="w-[100%] md:px-6 py-2 px-2 flex dark:text-gray-300 h-auto">
                                <img
                                    src={`${comment.profileImage}`}
                                    className="lg:w-[40px] lg:h-[40px] w-[30px] h-[30px] my-auto rounded-full lg:mr-5 mr-3"
                                />
                                <div className="w-[70%]">
                                    <p className="text-xs md:text-[10px] lg-text-xs w-[90%] break-words">
                                        <b className="dark:text-white text-gray-700">
                                            {comment.posted_by}
                                        </b>
                                        {` ${comment.content}`}
                                    </p>
                                    <p className="text-gray-500 lg:text-[0.6rem] md:text-[0.4rem] text-[0.6rem] mt-2">
                                        {new Date(
                                            comment.commentedAt
                                        ).toLocaleDateString("en-GB")}{" "}
                                        at{" "}
                                        {new Date(
                                            comment.commentedAt
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                {comment.isMe ? (
                                    <div className="ml-auto flex items-center">
                                        <FontAwesomeIcon
                                            icon={faTrash}
                                            className="text-red-500 hover:cursor-pointer"
                                            onClick={() =>
                                                handleCommentDeletion(
                                                    comment.id
                                                )
                                            }
                                        />
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                            <hr className="w-[70%] ml-[15%] border-t-1 border-gray-200 dark:border-border-dark" />
                        </React.Fragment>
                    ))
                ) : (
                    <div className="w-full h-full flex flex-col justify-center items-center">
                        {isLoading ? (
                            <>
                                <img
                                    src="/spinner.svg"
                                    className="w-[25%] mx-auto mb-2"
                                />
                                <h1 className="text-xs text-center dark:text-gray-300 text-gray-800">
                                    Fetching comments.
                                </h1>
                            </>
                        ) : (
                            <h1 className="text-xs text-center dark:text-gray-300 text-gray-800">
                                No comments available.
                            </h1>
                        )}
                    </div>
                )}
            </div>
            <div>
                <form className="bg-primary-light dark:bg-primary-dark w-full h-10 flex items-center md:justify-around justify-between border-t-[1px] border-gray-200 dark:border-border-dark">
                    <input
                        ref={ref}
                        className="bg-transparent focus:border-none focus:outline-none md:text-sm dark:caret-white dark:placeholder-gray-300 dark:text-gray-100 text-xs md:ml-0 ml-5"
                        placeholder="Add a comment..."
                        onChange={handleCommentChange}
                        value={newComment}
                    />
                    <button className={postButton} onClick={handleCommentPost}>
                        Post
                    </button>
                </form>
            </div>
        </div>
    );
});

export default CommentSection;
