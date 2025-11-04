import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [error, setError] = useState("");
    const [tokenValid, setTokenValid] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                await api.post("/auth/check-token", { token });
                setTokenValid(true);
            } catch (err) {
                setTokenValid(false);
            }
        };
        verifyToken();
    }, [token]);

    const handleNewChange = (e) => {
        setError("");
        setNewPassword(e.target.value);
    };

    const handleConfirmChange = (e) => {
        setError("");
        setConfirm(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (isLoading) return;

        if (!newPassword || !confirm) {
            setError("Please fill out all required fields.");
            return;
        }
        if (newPassword !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        try {
            setIsLoading(true);
            await api.put("/auth/reset-password", {
                token,
                newPass: newPassword,
            });
            setSuccess(true);
        } catch (err) {
            setError("Server is unreachable or the link is invalid.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <div className="w-full h-[100vh] flex flex-col items-center overflow-y-auto justify-center">
                {tokenValid === null && (
                    <p className="text-gray-500 dark:text-gray-300">
                        Verifying link...
                    </p>
                )}

                {tokenValid === false && (
                    <div className="text-center p-6 border border-gray-300 dark:border-border-dark rounded-xl bg-white dark:bg-primary-dark shadow-sm">
                        <h2 className="text-2xl font-bold text-red-500 mb-2">
                            Invalid or Expired Link
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            This password reset link is no longer valid. Please
                            request a new one.
                        </p>
                        <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-sm rounded-full px-4 py-2"
                            onClick={() => navigate("/forgot-password")}
                        >
                            Request New Link
                        </button>
                    </div>
                )}

                {tokenValid === true && !success && (
                    <form
                        className="md:w-[40%] sm:w-[60%] w-[80%] flex flex-col border-gray-300 border-solid border-[1px] py-6 px-8 rounded-xl dark:border-border-dark"
                        onSubmit={handleSubmit}
                    >
                        <h2 className="text-3xl mb-4 dark:text-white text-center md:text-start">
                            Change Password
                        </h2>
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
                        <p className="text-red-500 text-sm h-5">{error}</p>
                        <button
                            disabled={isLoading}
                            className="w-full h-8 mt-4 rounded-full bg-yellow-400 text-sm hover:bg-yellow-500 mb-5 disabled:bg-yellow-200"
                        >
                            {isLoading ? "Updating..." : "Change Password"}
                        </button>
                    </form>
                )}

                {success && (
                    <div className="text-center p-6 border border-gray-300 dark:border-border-dark rounded-xl bg-white dark:bg-primary-dark shadow-sm">
                        <h2 className="text-2xl font-bold text-green-500 mb-2">
                            Password Updated
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                            Your password has been successfully reset. You can
                            now log in with your new password.
                        </p>
                        <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-sm rounded-full px-4 py-2"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
