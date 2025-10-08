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

const SideBar = () => {
    return (
        <div className="h-[100vh] fixed left-0 top-0 w-[20%] bg-primary-light py-2 flex flex-col justify-between border-r-[1px] border-gray-300 dark:bg-primary-dark dark:border-border-dark">
            <div className="w-full h-auto">
                <Link to={"/"}>
                    <img
                        src="/Lumea.png"
                        className="block w-[50%] mx-[25%] dark:hidden"
                        alt="Logo"
                    />
                    <img
                        src="/Lumea-dark.png"
                        className="hidden w-[50%] mx-[25%] dark:block"
                        alt="Logo"
                    />
                </Link>
                <hr className="w-full border-t-1 border-gray-300 dark:border-border-dark" />

                <Link to={"/"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-start px-2 text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faHouse}
                            className="text-2xl mr-4"
                        />
                        <h1 className="text-xl font-semibold">Home</h1>
                    </div>
                </Link>

                <Link to={"/search"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-start px-2 text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faMagnifyingGlass}
                            className="text-2xl mr-4"
                        />
                        <h1 className="text-xl font-semibold">Search</h1>
                    </div>
                </Link>

                <Link to={"/create"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-start px-[10px] text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faPlus}
                            className="text-xl mr-4 border-black border-2 w-4 h-4 p-1 rounded-full dark:border-white"
                        />
                        <h1 className="text-xl font-semibold">Create</h1>
                    </div>
                </Link>

                <Link to={"/saved"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-start px-2 text-xl h-[2.5em] my-5 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faBookmark}
                            className="text-2xl mr-4"
                        />
                        <h1 className="text-xl font-semibold">Saved</h1>
                    </div>
                </Link>

                <Link to={"/"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-start px-2 text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faUser}
                            className="text-2xl mr-4"
                        />
                        <h1 className="text-xl font-semibold">Profile</h1>
                    </div>
                </Link>
            </div>
            <div className="w-full h-auto">
                <Link to={"/settings"}>
                    <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center justify-start px-2 text-xl h-[2.5em] my-7 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                        <FontAwesomeIcon
                            icon={faGear}
                            className="text-2xl mr-4"
                        />
                        <h1 className="text-xl font-semibold">Settings</h1>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default SideBar;
