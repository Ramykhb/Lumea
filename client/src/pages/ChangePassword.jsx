import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useRef, useState } from "react";

const ChangePassword = () => {
    const [error, setError] = useState("");

    const oldPasswordRef = useRef(null);
    const newPasswordRef = useRef(null);
    const confirmRef = useRef(null);

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");
        if (newPasswordRef.current.value != confirmRef.current.value) {
            setError("Passwords do not match.");
        }
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar />
            <div className="w-[80%] h-[100vh] ml-[20%] flex flex-col items-center overflow-y-auto justify-center">
                <form className="w-[40%] flex flex-col border-gray-300 border-solid border-[1px] py-6 px-8 rounded-xl dark:border-border-dark">
                    <h2 className="text-3xl mb-4 dark:text-white">
                        Change Password
                    </h2>
                    <label
                        className="text-sm font-bold dark:text-gray-100 mb-1"
                        htmlFor="old-password"
                    >
                        Old Password
                    </label>
                    <input
                        className="h-7 text-xs p-2 mb-5 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                        id="old-password"
                        name="old-password"
                        type="password"
                        ref={oldPasswordRef}
                    />
                    <label
                        className="text-sm font-bold dark:text-gray-100 mb-1"
                        htmlFor="new-password"
                    >
                        New Password
                    </label>
                    <input
                        className="h-7 text-xs p-2 mb-5 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                        id="new-password"
                        name="new-password"
                        type="password"
                        ref={newPasswordRef}
                    />
                    <label
                        className="text-sm font-bold dark:text-gray-100 mb-1"
                        htmlFor="confirm-password"
                    >
                        Confirm Password
                    </label>
                    <input
                        className="h-7 text-xs p-2 mb-1 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        ref={confirmRef}
                    />
                    <p className="text-red-500 text-sm">{error}</p>
                    <Link to={"/reset-password"}>
                        <p className="text-sm text-blue-600 text-center my-1">
                            Forgot password?
                        </p>
                    </Link>
                    <button
                        className="w-full h-8 mt-4 rounded-full bg-yellow-400 text-sm hover:bg-yellow-500 mb-5"
                        onClick={handleSubmit}
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
