import React from "react";

const UnavailablePage = (props) => {
    return (
        <div className="w-full h-[100vh] flex items-center justify-center bg-primary-light dark:bg-primary-dark">
            <div className="text-center flex flex-col items-center gap-4 p-8 bg-white/40 dark:bg-black/40 rounded-xl backdrop-blur-md shadow-lg dark:text-white">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-20 h-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                </svg>
                <h1 className="text-3xl font-semibold dark:text-white">
                    Lumea Currently Unavailable
                </h1>
                <p className="text-lg opacity-70 max-w-md dark:text-white">
                    Sorry Lumea is currently Unavailable.
                </p>
            </div>
        </div>
    );
};

export default UnavailablePage;
