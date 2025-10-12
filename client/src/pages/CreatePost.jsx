import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useEffect } from "react";

function CreatePost() {
    const [file, setFile] = useState(null);
    const [filePath, setFilePath] = useState("imagePlaceholder.png");
    const [caption, setCaption] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const handleUpload = async () => {
            if (!file) {
                return;
            }
            const formData = new FormData();
            formData.append("image", file);

            try {
                const res = await api.post(
                    "http://localhost:3000/api/v1/posts/upload",
                    formData,
                    {
                        headers: { "Content-Type": "multipart/form-data" },
                    }
                );
                setFilePath(res.data.filePath);
            } catch (err) {
                console.log("Error uploading image.");
            }
        };
        handleUpload();
    }, [file]);

    const handlePost = async (event) => {
        event.preventDefault();
        if (!file) {
            setError("Please select an image first.");
            return;
        }
        try {
            const res = await api.post(
                "http://localhost:3000/api/v1/posts/create",
                {
                    caption: caption,
                    filePath: filePath,
                }
            );
            navigate("/");
        } catch (err) {
            setError("Upload Failed.");
        }
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar />
            <div className="w-[80%] ml-[20%] min-h-[100vh] flex flex-col items-center overflow-y-auto">
                <div className="h-[14vh] flex flex-row justify-center items-center w-full">
                    <h1 className="text-2xl font-bold dark:text-gray-100">
                        Create Post
                    </h1>
                </div>
                <div className="w-full flex flex-row items-center justify-center h-[86vh]">
                    <div className="w-[50%] p-10 px-20">
                        <input
                            id="fileUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                        />

                        <label
                            htmlFor="fileUpload"
                            className="w-[50vh] h-[50vh] border-2 border-dashed border-gray-400 rounded-lg bg-cover bg-center flex items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-100/20 transition relative"
                            style={{
                                backgroundImage: file
                                    ? `url(http://localhost:3000${filePath})`
                                    : `url(${filePath})`,
                            }}
                        />
                    </div>
                    <div className="w-[50%] p-10 px-20 h-[86vh] flex items-center justify-center">
                        <form className="w-full min-h-[40%] flex flex-col border-gray-300 border-solid border-[1px] py-10 px-8 rounded-xl dark:border-border-dark justify-around">
                            <label
                                className="text-sm font-bold dark:text-gray-100 mb-1"
                                htmlFor="caption"
                            >
                                Caption
                            </label>
                            <input
                                className="h-7 text-xs p-2 mb-3 w-full rounded-md bg-primary-light dark:bg-primary-dark border-[1px] border-gray-500 dark:text-gray-100"
                                id="caption"
                                name="caption"
                                type="text"
                                placeholder="Write a caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                            <p className="text-sm text-red-500 my-4">{error}</p>
                            <button
                                className="w-full h-8 mt-4 rounded-full bg-yellow-400 text-sm hover:bg-yellow-500 mb-5"
                                onClick={handlePost}
                            >
                                Post
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
