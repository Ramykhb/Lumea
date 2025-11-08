import api from "@/api/axios";
import SideBar from "@/components/SideBar";
import { backendPath } from "@/config/backConfig";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotificationsPage = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        if (!isLoading) {
            try {
                setIsLoading(true);
                const res = await api.get(`/interactions/notifications`);
                setNotifications(res.data);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false);
            }
            try {
                const res = await api.put(`/interactions/read-notifications`);
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar username={props.username} userId={props.userId} />
            <div className="md:w-[80%] w-[85%] md:ml-[20%] ml-[15%] min-h-[100vh] flex flex-col items-center overflow-y-auto">
                <div className="h-[14vh] flex flex-row justify-center items-center w-full">
                    <h1 className="text-2xl font-bold dark:text-gray-100">
                        Latest Notifications
                    </h1>
                </div>
                <p className="dark:text-gray-100 text-center text-xs md:text-sm mb-2">
                    Read notifications are automatically deleted after 3 days.
                </p>
                {notifications.length > 0 ? (
                    notifications.map((not) => (
                        <React.Fragment key={not.id}>
                            <Link
                                to={
                                    not.type === 1
                                        ? `/chat/${not.username}`
                                        : `/profile/${not.username}`
                                }
                                className="sm:w-[60%] xl:w-[70%] w-[90%] h-15 rounded-xl flex flex-col my-2 hover:bg-gray-200 hover:cursor-pointer dark:hover:bg-gray-700"
                            >
                                <div className="h-15 rounded-xl p-2 my-1 flex hover:bg-gray-200 hover:cursor-pointer dark:hover:bg-gray-700">
                                    <img
                                        src={`${backendPath}${not.profileImage}`}
                                        className="sm:w-14 sm:h-14 h-10 w-10 rounded-full border-[2px] border-yellow-400 object-cover"
                                    />
                                    <div className="h-full w-full flex justify-start items-center ml-2 md:ml-5 md:text-base dark:text-gray-100 text-sm">
                                        <div
                                            className="bg-red-500 mr-2  w-2 h-2 rounded-full"
                                            style={
                                                !not.isDelivered > 0
                                                    ? { display: "block" }
                                                    : { display: "none" }
                                            }
                                        ></div>
                                        <p>
                                            <b>{not.username}</b>
                                            {not.type === 1
                                                ? " sent you a message."
                                                : not.type === 2
                                                ? " started following you."
                                                : not.type === 3
                                                ? " liked your post."
                                                : " commented on your post."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-end mr-5">
                                    <p className="text-gray-500 md:text-[0.6rem] text-[0.5rem] mt-2 text-nowrap">
                                        {new Date(
                                            not.sentAt
                                        ).toLocaleDateString("en-GB")}{" "}
                                        at{" "}
                                        {new Date(
                                            not.sentAt
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </Link>
                            <hr className="w-[25%] border-t-1 border-gray-300 dark:border-border-dark" />
                        </React.Fragment>
                    ))
                ) : (
                    <div className="h-[80dvh] flex flex-col items-center justify-center w-full">
                        {isLoading ? (
                            <>
                                <img
                                    src="/spinner.svg"
                                    className="w-[25%] mx-auto mb-2"
                                />
                                <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                                    Fetching notifications
                                </h1>
                            </>
                        ) : (
                            <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                                No notifications found.
                            </h1>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
