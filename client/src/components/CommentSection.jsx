import { forwardRef, useEffect, useState } from "react";
import api from "../api/axios";

const CommentSection = forwardRef((props, ref) => {
    const [comments, setComments] = useState([]);
    const [postButton, setPostButton] = useState(
        "text-md text-blue-200 dark:text-blue-200"
    );
    const [newComment, setNewComment] = useState("");

    const getComments = async () => {
        try {
            const res = await api.get("/posts/comments", {
                params: {
                    postId: props.postId,
                },
            });
            const comments = res.data;
            setComments(comments);
        } catch (error) {
            console.log("Error getting comments");
        }
    };

    useEffect(() => {
        getComments();
    }, []);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
        if (e.target.value.length == 0) {
            setPostButton("text-md text-blue-200 dark:text-blue-200");
        } else {
            setPostButton("hover:cursor-pointer text-md text-blue-600");
        }
    };

    const handleCommentPost = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("posts/comment", {
                postId: props.postId,
                content: newComment,
            });
            setComments([res.data.newComment, ...comments]);
            setNewComment("");
            setPostButton("text-md text-blue-200");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div
            className="w-[50%] relative flex flex-col"
            style={{
                height: props.maxHeight ? `${props.maxHeight}px` : "auto",
            }}
        >
            <div
                style={{
                    height: props.maxHeight
                        ? `${props.maxHeight - 40}px`
                        : "auto",
                }}
                className="w-full bg-primary-light dark:bg-primary-dark flex flex-col overflow-y-auto rounded-tr-2xl rounded-br-2xl border-gray-200 border-r-[1px] dark:border-border-dark"
            >
                <div className="w-full sticky left-0 top-0 flex py-3 items-center justify-center border-b-[1px] border-gray-300 dark:border-border-dark bg-primary-light dark:bg-primary-dark">
                    <p className="text-sm font-semibold dark:text-gray-100 py-1">
                        Comments
                    </p>
                </div>
                {comments.length > 0 ? (
                    comments.map((comment, i) => (
                        <div key={comment.id}>
                            <div className="w-[100%] px-6 py-2 flex dark:text-gray-300 h-auto">
                                <img
                                    src={`http://localhost:3000${comment.profileImage}`}
                                    className="w-[40px] rounded-full mr-5"
                                />
                                <div>
                                    <p className="text-xs">
                                        <b className="dark:text-white text-gray-700">
                                            {comment.posted_by}
                                        </b>
                                        {` ${comment.content}`}
                                    </p>
                                    <p className="text-gray-500 text-[0.6rem] mt-2">
                                        {comment.commentedAt.split("T")[0]}
                                    </p>
                                </div>
                            </div>
                            <hr className="w-[70%] ml-[15%] border-t-1 border-gray-200 dark:border-border-dark" />
                        </div>
                    ))
                ) : (
                    <div className="w-full h-full flex justify-center items-center">
                        <h3 className="text-center text-sm text-gray-500 dark:text-gray-100">
                            No comments available...
                        </h3>
                    </div>
                )}
            </div>
            <div>
                <form className="bg-primary-light dark:bg-primary-dark w-full h-10 flex items-center justify-around border-t-[1px] border-gray-200 dark:border-border-dark">
                    <input
                        ref={ref}
                        className="bg-transparent focus:border-none focus:outline-none text-sm dark:caret-white dark:placeholder-gray-300 dark:text-gray-100"
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
