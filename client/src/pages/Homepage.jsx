import { useState } from "react";
import Post from "../components/Post";
import SideBar from "../components/SideBar";

const Homepage = () => {
    const [posts, setposts] = useState([]);
    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar />
            <div className="w-[80%] h-[90em] ml-[20%] flex flex-col items-center overflow-y-auto">
                <Post />
                <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                <Post />
                <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                <Post />
                <hr className="w-[50%] border-t-1 border-gray-400 dark:border-border-dark" />
                <Post />
            </div>
        </div>
    );
};

export default Homepage;
