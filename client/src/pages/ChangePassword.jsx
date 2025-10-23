import { Link, useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useState } from "react";
import api from "../api/axios";

const ChangePassword = (props) => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const handleOldChange = (event) => {
        setError("");
        setOldPassword(event.target.value);
    };
    const handleNewChange = (event) => {
        setError("");
        setNewPassword(event.target.value);
    };
    const handleConfirmChange = (event) => {
        setError("");
        setConfirm(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        console.log(oldPassword + newPassword + confirm);
        if (!oldPassword || !newPassword || !confirm) {
            setError("Please fill out all required fields.");
            return;
        }
        if (newPassword != confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        try {
            const res = await api.put("/auth/updatePassword", {
                currentPass: oldPassword,
                newPass: newPassword,
            });
            navigate("/");
        } catch (err) {
            if (err.status == 401) {
                setError("Current password is incorrect.");
            } else setError("Server is unreachable at the moment.");
        }
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar username={props.username} />
            <div className="md:w-[80%] w-[85%] md:ml-[20%] ml-[15%] h-[100vh] flex flex-col items-center overflow-y-auto justify-center">
                <form className="md:w-[40%] sm:w-[60%] w-[80%] flex flex-col border-gray-300 border-solid border-[1px] py-6 px-8 rounded-xl dark:border-border-dark">
                    <h2 className="text-3xl mb-4 dark:text-white text-center md:text-start">
                        Change Password
                    </h2>
                    <label
                        className="text-sm font-bold dark:text-gray-100 mb-1"
                        htmlFor="old-password"
                    >
                        Current Password
                    </label>
                    <input
                        className="h-7 text-xs p-2 mb-5 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                        id="old-password"
                        name="old-password"
                        type="password"
                        onChange={handleOldChange}
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
                        onChange={handleNewChange}
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
                        onChange={handleConfirmChange}
                    />
                    <p className="text-red-500 text-sm">{error}</p>
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
