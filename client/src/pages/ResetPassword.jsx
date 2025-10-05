import { useState } from "react";
import SideBar from "../components/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

const ResetPassword = (props) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleChange = (event) => {
        setError("");
        setEmail(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!email) {
            setError("Please enter your email");
        }
        console.log(email);
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            {props.logged ? <SideBar /> : ""}
            <div
                className="h-[100vh] flex flex-col items-center overflow-y-auto justify-center"
                style={
                    props.logged
                        ? { width: "80%", marginLeft: "20%" }
                        : { width: "100%" }
                }
            >
                <form
                    className="flex flex-col border-gray-300 border-solid border-[1px] py-6 px-8 rounded-xl dark:border-border-dark"
                    style={props.logged ? { width: "40%" } : { width: "30%" }}
                >
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
                    />
                    <p className="text-sm text-red-500">{error}</p>
                    <button
                        className="w-full h-8 mt-4 rounded-full bg-yellow-400 text-sm hover:bg-yellow-500 mb-5"
                        onClick={handleSubmit}
                    >
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
