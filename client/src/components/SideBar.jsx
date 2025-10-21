import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHouse,
    faBookmark,
    faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
    faMagnifyingGlass,
    faPlus,
    faGear,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import api from "@/api/axios";

const SideBar = (props) => {
    useEffect(() => {
        const getUser = async () => {
            if (!props.username) {
                try {
                    const res = await api.get("/auth/user");
                    props.onUser(res.data.username);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        getUser();
    }, []);

    return (
        <div className="h-[100dvh] fixed left-0 top-0 md:w-[20%] w-[15%] bg-primary-light py-2 flex flex-col justify-between border-r-[1px] border-gray-300 dark:bg-primary-dark dark:border-border-dark">
            <div className="w-full h-auto">
                <Link to={"/"}>
                    <picture>
                        <source
                            srcSet="/Lumea.png"
                            media="(min-width: 770px)"
                        />
                        <img
                            src="/lumea-icon.png"
                            alt="Logo"
                            className="mx-auto dark:hidden md:w-[50%] w-[65%] sm:w-[55%]"
                        />
                    </picture>
                    <picture>
                        <source
                            srcSet="/Lumea-dark.png"
                            media="(min-width: 770px)"
                        />
                        <img
                            src="/lumea-icon.png"
                            alt="Logo"
                            className="hidden mx-auto dark:block md:w-[50%] w-[65%] sm:w-[55%]"
                        />
                    </picture>
                </Link>
                <hr className="w-full border-t-1 border-gray-300 dark:border-border-dark" />

                <Link to={"/"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-center md:justify-start px-2 text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faHouse}
                            className="text-2xl md:mr-4"
                        />
                        <h1 className="text-xl font-semibold hidden md:block">
                            Home
                        </h1>
                    </div>
                </Link>

                <Link to={"/search"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-center md:justify-start px-2 text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="text-2xl md:mr-4"
                        />
                        <h1 className="text-xl font-semibold hidden md:block">
                            Search
                        </h1>
                    </div>
                </Link>

                <Link to={"/create"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-center md:justify-start px-[10px] text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="text-xl md:mr-4 border-black border-2 w-4 h-4 p-1 rounded-full dark:border-white"
                        />
                        <h1 className="text-xl font-semibold hidden md:block">
                            Create
                        </h1>
                    </div>
                </Link>

                <Link to={"/saved"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-center md:justify-start px-2 text-xl h-[2.5em] my-5 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faBookmark}
                            className="text-2xl md:mr-4"
                        />
                        <h1 className="text-xl font-semibold hidden md:block">
                            Saved
                        </h1>
                    </div>
                </Link>

                <Link to={`/profile/${props.username}`}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-center md:justify-start px-2 text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faUser}
                            className="text-2xl md:mr-4"
                        />
                        <h1 className="text-xl font-semibold hidden md:block">
                            Profile
                        </h1>
                    </div>
                </Link>
            </div>
            <div className="w-full h-auto">
                <Link to={"/settings"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-center md:justify-start px-2 text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faGear}
                            className="text-2xl md:mr-4"
                        />
                        <h1 className="text-xl font-semibold hidden md:block">
                            Settings
                        </h1>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default SideBar;
