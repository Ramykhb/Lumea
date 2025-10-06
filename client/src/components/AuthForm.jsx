import { useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect } from "react";

const AuthForm = (props) => {
    const navigate = useNavigate();

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    useEffect(() => {
        const checkLoggedIn = async () => {
            const res = await api.get("/users/status");
            if (res.data.loggedIn) navigate("/");
        };

        checkLoggedIn();
    }, []);

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmChange = (event) => {
        setConfirm(event.target.value);
    };

    const handleRedirect = (event) => {
        event.preventDefault();
        const temp = props.method === "login" ? "signup" : "login";
        navigate(`/${temp}`);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setUsernameError("");
        setEmailError("");
        setPasswordError("");
        if (props.method === "signup") {
            if (!email || !username || !password || !confirm) {
                setPasswordError("Please fill out all the required data...");
                return;
            }
            if (password != confirm) {
                setPasswordError("Passwords do not match...");
                return;
            }
            if (username.includes(" ")) {
                setUsernameError("Username cannot contain blank characters...");
                return;
            }
            if (!email.includes("@")) {
                setEmailError("Invalid email...");
                return;
            }
            if (password.length < 8) {
                setPasswordError("Password must be as least 8 characters...");
                return;
            }
            try {
                const res = await api.post("/users/signup", {
                    username: username,
                    email: email,
                    password: password,
                });
                const { accessToken } = res.data;
                localStorage.setItem("accessToken", accessToken);
                navigate("/");
            } catch (err) {
                if (err.response) {
                    const { error, message } = err.response.data;

                    if (error === "EmailAlreadyUsed") {
                        setEmailError(message);
                    } else if (error === "UsernameAlreadyUsed") {
                        setUsernameError(message);
                    }
                }
            }
        } else {
            if (!username || !password) {
                setPasswordError("Please fill out all the required data...");
                return;
            }
            try {
                const res = await axios.post(
                    "http://localhost:3000/api/v1/users/login",
                    {
                        username: username,
                        password: password,
                    }
                );
            } catch (err) {
                if (err.response) {
                    const { error, message } = err.response.data;

                    if (error === "UsernameNotFound") {
                        setUsernameError(message);
                    } else if (error === "IncorrectPassword") {
                        setPasswordError(message);
                    }
                }
            }
        }
    };

    return (
        <form className="w-full flex flex-col border-gray-300 border-solid border-[1px] py-6 px-8 rounded-xl dark:border-border-dark">
            <h2 className="text-3xl mb-4 dark:text-white">
                {props.method === "login" ? "Sign in" : "Sign up"}
            </h2>
            <label
                className="text-sm font-bold dark:text-gray-100 mb-1"
                htmlFor="username"
            >
                Username
            </label>
            <input
                className="h-7 text-xs p-2 mb-3 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                id="username"
                name="username"
                type="text"
                onChange={handleUsernameChange}
            />
            <p className="text-red-500 text-xs mb-1">{usernameError}</p>
            {props.method == "signup" ? (
                <>
                    <label
                        className="text-sm font-bold dark:text-gray-100 mb-1"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className="h-7 text-xs p-2 mb-3 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                        id="email"
                        name="email"
                        type="email"
                        onChange={handleEmailChange}
                    />
                    <p className="text-red-500 text-xs mb-1">{emailError}</p>
                </>
            ) : (
                ""
            )}
            <label
                className="text-sm font-bold dark:text-gray-100 mb-1"
                htmlFor="password"
            >
                Password
            </label>
            <input
                className="h-7 text-xs p-2 mb-3 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                id="password"
                name="password"
                type="password"
                onChange={handlePasswordChange}
            />
            {props.method == "signup" ? (
                <>
                    <label
                        className="text-sm font-bold dark:text-gray-100 mb-1"
                        htmlFor="confirm-password"
                    >
                        Confirm Password
                    </label>
                    <input
                        className="h-7 text-xs p-2 mb-3 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        onChange={handleConfirmChange}
                    />
                </>
            ) : (
                ""
            )}
            <p className="text-red-500 text-xs mb-1">{passwordError}</p>
            {props.method === "login" ? (
                <Link to={"/reset-password"}>
                    <p className="text-sm text-blue-600 text-center my-1">
                        Forgot password?
                    </p>
                </Link>
            ) : (
                ""
            )}
            <button
                className="w-full h-8 mt-4 rounded-full bg-yellow-400 text-sm hover:bg-yellow-500 mb-5"
                onClick={handleSubmit}
            >
                {props.method === "login" ? "Sign in" : "Sign up"}
            </button>
            <div className="flex items-center w-full">
                <div className="flex-grow border-b border-gray-300"></div>
                <span className="mx-4 text-sm text-gray-500 dark:text-gray-300">
                    {props.method == "login"
                        ? "New to Lumea?"
                        : "Already have an account?"}
                </span>
                <div className="flex-grow border-b border-gray-300"></div>
            </div>
            <button
                className="w-full rounded-full bg-primary-light dark:bg-primary-dark dark:hover:bg-[#202020] dark:text-gray-100 border-[1px] border-gray-500 h-8 text-sm hover:bg-[#eaeaea] mt-5"
                onClick={handleRedirect}
            >
                {props.method === "login"
                    ? "Create a Lumea account"
                    : "Login to your Lumea Account"}
            </button>
        </form>
    );
};

export default AuthForm;
