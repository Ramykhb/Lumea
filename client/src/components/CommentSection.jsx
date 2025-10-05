import { forwardRef, useEffect, useState } from "react";

const CommentSection = forwardRef((props, ref) => {
    const [comments, setComments] = useState([]);
    const [postButton, setPostButton] = useState("");
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        setComments([
            {
                message: "This is a great post! Thanks for sharing.",
                posted_by: "Alice",
                posted_at: "2025-09-27_14:35:00",
            },
            {
                message: "I totally agree with your point.",
                posted_by: "Bob",
                posted_at: "2025-09-27_15:10:00",
            },
            {
                message: "Can you explain more about this?",
                posted_by: "Charlie",
                posted_at: "2025-09-27_15:45:00",
            },
            {
                message: "Nice photo! Where was this taken?",
                posted_by: "Diana",
                posted_at: "2025-09-27_16:20:00",
            },
            {
                message: "Love the details you added here 👏",
                posted_by: "Ethan",
                posted_at: "2025-09-27_16:55:00",
            },
            {
                message: "This is a great post! Thanks for sharing.",
                posted_by: "Alice",
                posted_at: "2025-09-27_14:35:00",
            },
            {
                message: "I totally agree with your point.",
                posted_by: "Bob",
                posted_at: "2025-09-27_15:10:00",
            },
            {
                message: "Can you explain more about this?",
                posted_by: "Charlie",
                posted_at: "2025-09-27_15:45:00",
            },
            {
                message: "Nice photo! Where was this taken?",
                posted_by: "Diana",
                posted_at: "2025-09-27_16:20:00",
            },
            {
                message: "Love the details you added here 👏",
                posted_by: "Ethan",
                posted_at: "2025-09-27_16:55:00",
            },
        ]);
        setPostButton("text-md text-blue-200");
    }, []);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
        if (e.target.value.length == 0) {
            setPostButton("text-md text-blue-200");
        } else {
            setPostButton("hover:cursor-pointer text-md text-blue-600");
        }
    };

    return (
        <div
            className="w-[50%] relative flex flex-col"
            style={{
                height: props.maxHeight ? `${props.maxHeight}px` : "auto",
            }}
        >
            {/* Comments container */}
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
                        <div key={i}>
                            <div className="w-[100%] px-6 py-2 flex dark:text-gray-300">
                                <img
                                    src="/avatar.svg"
                                    className="w-[40px] rounded-full mr-5"
                                />
                                <div>
                                    <p className="text-xs">
                                        <b className="dark:text-white text-gray-700">
                                            {comment.posted_by}
                                        </b>
                                        {` ${comment.message}`}
                                    </p>
                                    <p className="text-gray-500 text-[0.6rem] mt-2">
                                        {comment.posted_at}
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
            <div className="bg-primary-light dark:bg-primary-dark w-full h-10 flex items-center justify-around border-t-[1px] border-gray-200 dark:border-border-dark">
                <input
                    ref={ref}
                    className="bg-transparent focus:border-none focus:outline-none text-sm dark:caret-white dark:placeholder-gray-300 dark:text-gray-100"
                    placeholder="Add a comment..."
                    onChange={handleCommentChange}
                    value={newComment}
                />
                <p className={postButton}>Post</p>
            </div>
        </div>
    );
});

export default CommentSection;
