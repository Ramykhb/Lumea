import { forwardRef, useEffect, useState } from "react";
import api from "../api/axios";
import { backendPath } from "@/config/backConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const LikeSection = forwardRef((props, ref) => {
    const [likes, setLikes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getLikes = async () => {
        if (!isLoading) {
            try {
                setIsLoading(true);
                const res = await api.get("/interactions/likes", {
                    params: {
                        postId: props.postId,
                    },
                });
                const likes = res.data;
                setLikes(likes);
            } catch (error) {
                console.log("Error getting likes.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        if (props.showLikes) {
            getLikes();
        }
    }, []);

    useEffect(() => {
        if (props.showLikes) {
            getLikes();
        }
    }, [props.showLikes]);

    return (
        <div
            className="md:w-[50%] w-full relative flex flex-col  border-gray-200 dark:border-border-dark md:border-t-0"
            style={{
                height: props.maxHeight ? `${props.maxHeight}px` : "auto",
                display: props.showLikes ? "block" : "none",
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
                <div className="w-full sticky left-0 top-0 flex py-2 items-center justify-between border-b-[1px] border-gray-300 dark:border-border-dark bg-primary-light dark:bg-primary-dark">
                    <FontAwesomeIcon
                        icon={faClose}
                        className="text-white ml-3 opacity-0"
                    />
                    <p className="text-sm font-semibold dark:text-gray-100 py-1">
                        Liked By
                    </p>
                    <FontAwesomeIcon
                        icon={faClose}
                        className="dark:text-white mr-3 hover:cursor-pointer md:opacity-0"
                        onClick={props.onToggleShowLikes}
                    />
                </div>
                {likes.length > 0 ? (
                    likes.map((like) => (
                        <div
                            key={like.posted_by}
                            className="hover:cursor-pointer"
                            onClick={() => {
                                console.log("CLICKED");
                                navigate(`/profile/${like.posted_by}`);
                            }}
                        >
                            <div className="w-[100%] md:px-6 py-2 px-2 flex dark:text-gray-300 h-auto items-center">
                                <img
                                    src={`${like.profileImage}`}
                                    className="w-[40px] h-[40px] my-auto rounded-full mr-5"
                                />
                                <div>
                                    <p className="text-xs">
                                        <b className="dark:text-white text-gray-700">
                                            {like.posted_by}
                                        </b>
                                    </p>
                                </div>
                            </div>
                            <hr className="w-[70%] ml-[15%] border-t-1 border-gray-200 dark:border-border-dark" />
                        </div>
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
                                    Fetching likes
                                </h1>
                            </>
                        ) : (
                            <h1 className="text-xs text-center dark:text-gray-300 text-gray-800">
                                No likes available.
                            </h1>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
});

export default LikeSection;
