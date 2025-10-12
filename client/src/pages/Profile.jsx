import { useEffect, useState } from "react";
import api from "../api/axios";
import SideBar from "../components/SideBar";
import React from "react";
import {useParams} from "react-router-dom";


const Homepage = () => {

        const {username} = useParams();

    useEffect(() => {
        console.log(username);
        // const fetchPosts = async () => {
        //     try {
        //         const res = await api.get("/posts");
        //         setposts(res.data);
        //     } catch (err) {
        //         console.error("Error fetching posts:", err);
        //     }
        // };
        //
        // fetchPosts();
    }, []);


    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar />
            <div className="w-[80%] h-[90em] ml-[20%] flex flex-col items-center overflow-y-auto">

            </div>
        </div>
    );
};

export default Homepage;
