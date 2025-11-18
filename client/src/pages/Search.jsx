import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { backendPath } from "@/config/backConfig";

const Search = (props) => {
    const [searchVal, setSearchVal] = useState("");
    const [profiles, setProfiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (searchVal) {
                setIsLoading(true);
                try {
                    const res = await api.get("/auth/profiles", {
                        params: { searchVal },
                    });
                    setProfiles(res.data);
                } catch (err) {
                    setProfiles([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setProfiles([]);
            }
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchVal]);

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar username={props.username} userId={props.userId} />
            <div className="md:w-[80%] w-[85%] md:ml-[20%] ml-[15%] min-h-[100vh] flex flex-col items-center overflow-y-auto">
                <p className="mt-10 text-3xl font-bold dark:text-gray-100">
                    Search
                </p>
                <input
                    placeholder="Enter username"
                    className="w-[60%] rounded-xl text-center my-[2em] h-10 bg-[#ededed] dark:bg-[#353535] focus:border-none focus:outline-none dark:placeholder-gray-100 dark:text-gray-100"
                    value={searchVal}
                    onChange={(event) => {
                        setSearchVal(event.target.value);
                    }}
                />
                {isLoading ? (
                    <>
                        <img
                            src="/spinner.svg"
                            className="w-[15%] mx-auto mb-2"
                        />
                        <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                            Fetching users
                        </h1>
                    </>
                ) : profiles.length > 0 ? (
                    profiles.map((profile) => (
                        <React.Fragment key={profile.id}>
                            <Link
                                to={`/profile/${profile.username}`}
                                className="sm:w-[60%] xl:w-[70%] w-[90%] h-15 rounded-xl flex my-2 hover:bg-gray-200 hover:cursor-pointer dark:hover:bg-gray-700"
                            >
                                <div className="sm:w-[60%] xl:w-[70%] w-[90%] h-15 rounded-xl p-2 my-1 flex hover:bg-gray-200 hover:cursor-pointer dark:hover:bg-gray-700">
                                    <img
                                        src={`${backendPath}${profile.profileImage}`}
                                        className="sm:w-14 sm:h-14 h-10 w-10 rounded-full border-[2px] border-yellow-400"
                                    />
                                    <div className="h-full flex flex-col justify-center items-center ml-5 text-base dark:text-gray-100">
                                        <p>{profile.username}</p>
                                    </div>
                                </div>
                            </Link>
                            <hr className="w-[25%] border-t-1 border-gray-300 dark:border-border-dark" />
                        </React.Fragment>
                    ))
                ) : (
                    <div className="h-[60vh] flex items-center justify-center">
                        <h1 className="sm:text-lg text-base text-center dark:text-gray-300 text-gray-800">
                            No Users found.
                        </h1>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
