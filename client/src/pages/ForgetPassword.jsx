import { useState } from "react";
import SideBar from "../components/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import api from "@/api/axios";
import { backendPath } from "@/config/backConfig";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleChange = (event) => {
        setError("");
        setEmail(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        if (!isLoading) {
            if (!email) {
                setError("Please enter your email");
                return;
            }
            try {
                setIsLoading(true);
                const res = await api.post(`/auth/forget-password`, {
                    email: email,
                });
                setIsSent(true);
            } catch (err) {
                if (err.status === 404) {
                    setError("Email not found");
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <div className="h-[100vh] flex flex-col items-center overflow-y-auto justify-center w-full">
                <form className="flex flex-col border-gray-300 border-solid border-[1px] py-6 px-8 rounded-xl dark:border-border-dark md:w-[30%] sm:w-[40%] xs:w-[50%] w-[60%]">
                    <div className="w-full flex flex-col items-center">
                        <FontAwesomeIcon
                            icon={faLock}
                            className="border-2 border-black rounded-full text-5xl h-16 w-16 p-4 dark:text-gray-200 dark:border-gray-200"
                        />
                        <p className="my-2 text-lg dark:text-white">
                            Trouble Signing In?
                        </p>
                        <p className="my-2 text-sm text-gray-500 dark:text-gray-200">
                            Enter your email and we'll send you a link to get
                            back into your account.
                        </p>
                    </div>
                    <input
                        className="h-7 text-xs p-2 mb-5 mt-5 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        style={
                            isSent ? { display: "none" } : { display: "block" }
                        }
                    />
                    <p className="text-xs text-red-500">{error}</p>
                    <button
                        className="w-full h-8 mt-4 rounded-full bg-yellow-400 text-sm hover:bg-yellow-500 mb-5"
                        onClick={handleSubmit}
                        style={
                            isSent ? { display: "none" } : { display: "block" }
                        }
                    >
                        Send Email
                    </button>
                    <p
                        className="my-2 text-xs text-gray-500 dark:text-gray-200"
                        style={
                            !isSent ? { display: "none" } : { display: "block" }
                        }
                    >
                        An email has been sent to{" "}
                        <span className="text-black dark:text-white font-bold">
                            {email}
                        </span>
                        , please allow up to 5 mins for it to arrive.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default ForgetPassword;
