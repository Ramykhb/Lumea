import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";

const Settings = (props) => {
    const handleLogout = () => {
        return;
    };

    const handleDeleteAccount = () => {
        return;
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar />
            <div className="w-[80%] h-[100vh] ml-[20%] flex flex-col items-center overflow-y-auto justify-center">
                <div className="w-[350px] py-7 dark:bg-primary-dark bg-primary-light dark:border-border-dark rounded-2xl border-gray-300 border-[1px] flex-col flex items-center">
                    <p className="text-2xl font-bold text-black dark:text-white mb-7 w-full text-center">
                        Settings
                    </p>
                    <div className="flex justify-between w-[90%] my-2 ml-[5%]">
                        <p className="font-bold dark:text-white">Dark Mode</p>
                        <div
                            onClick={props.onToggleDarkMode}
                            className={`w-14 h-8 flex mr-5 items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                                props.darkModeOn
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                            }`}
                        >
                            <div
                                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                                    props.darkModeOn
                                        ? "translate-x-6"
                                        : "translate-x-0"
                                }`}
                            />
                        </div>
                    </div>
                    <Link to={"/change-password"} className="w-full">
                        <div className="text-black w-[90%] mx-[5%] rounded-xl flex items-center px-2 text-md h-[2.5em] my-2 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]">
                            <p className="font-bold">Change Password</p>
                        </div>
                    </Link>
                    <div
                        className="text-black w-[90%] mx-[5%] rounded-xl flex items-center px-2 text-md h-[2.5em] my-2 hover:bg-[#dfdfe0] hover:cursor-pointer dark:text-white dark:hover:bg-[#2c2c2c]"
                        onClick={handleLogout}
                    >
                        <p className="font-bold">Log out</p>
                    </div>
                    <div
                        className="text-black w-[90%] mx-[5%] rounded-xl flex items-center px-2 text-md h-[2.5em] my-2 hover:bg-[#EF4444] hover:cursor-pointer dark:text-white dark:hover:bg-red-600"
                        onClick={handleDeleteAccount}
                    >
                        <p className="font-bold">Delete Account</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
