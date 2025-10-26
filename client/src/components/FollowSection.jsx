import { forwardRef, useEffect, useState } from "react";
import api from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { uploadsPath } from "@/config/imagesConfig";

const FollowSection = forwardRef((props, ref) => {
    const [follows, setFollows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const getFollows = async () => {
        const path = props.showFollowers
            ? "/auth/followers"
            : "/auth/following";
        if (!isLoading) {
            try {
                setIsLoading(true);
                const res = await api.get(path, {
                    params: {
                        username: props.username,
                    },
                });
                setFollows(res.data);
            } catch (error) {
                console.log("Error getting likes.");
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        setFollows([]);
        if (props.showFollowers || props.showFollowings) {
            getFollows();
        }
    }, [props.showFollowers]);

    useEffect(() => {
        setFollows([]);
        if (props.showFollowers || props.showFollowings) {
            getFollows();
        }
    }, [props.showFollowings]);

    return (
        <div
            style={{
                height: props.maxHeight ? `${props.maxHeight - 40}px` : "auto",
            }}
            className="xl:w-[50%] sm:w-[80%] md:w-[70%] lg:w-[60%] w-[90%] bg-primary-light dark:bg-primary-dark flex flex-col overflow-y-auto border-gray-200 border-[1px] dark:border-border-dark min-h-[70vh] h-[70vh] rounded-3xl"
        >
            <div className="w-full sticky left-0 top-0 flex py-2 items-center justify-between border-b-[1px] border-gray-300 dark:border-border-dark bg-primary-light dark:bg-primary-dark">
                <FontAwesomeIcon
                    icon={faClose}
                    className="text-white ml-3 opacity-0"
                />
                <p className="text-sm font-semibold dark:text-gray-100 py-1">
                    {props.showFollowers ? "Followers" : "Following"}
                </p>
                <FontAwesomeIcon
                    icon={faClose}
                    className="dark:text-white mr-3 hover:cursor-pointer"
                    onClick={
                        props.showFollowers
                            ? props.onToggleFollowers
                            : props.onToggleFollowings
                    }
                />
            </div>
            {follows.length > 0 ? (
                follows.map((follow) => (
                    <div key={follow.username}>
                        <div
                            className="w-[100%] md:px-6 py-2 px-2 flex dark:text-gray-300 h-auto items-center hover:cursor-pointer"
                            onClick={() => {
                                navigate(`/profile/${follow.username}`);
                            }}
                        >
                            <img
                                src={`${uploadsPath}${follow.profileImage}`}
                                className="w-[40px] h-[40px] my-auto rounded-full mr-5"
                            />
                            <div>
                                <p className="text-sm">
                                    <b className="dark:text-white text-gray-700">
                                        {follow.username}
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
                            <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                                {props.showFollowers
                                    ? "Fetching followers."
                                    : "Fetching following."}
                            </h1>
                        </>
                    ) : (
                        <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                            {props.showFollowers
                                ? "No followers available."
                                : "No following available."}
                        </h1>
                    )}
                </div>
            )}
        </div>
    );
});

export default FollowSection;
