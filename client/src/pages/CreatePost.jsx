import { use, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import { useEffect } from "react";
import { uploadsPath } from "@/config/imagesConfig";

function CreatePost(props) {
    const [file, setFile] = useState(null);
    const [filePath, setFilePath] = useState("placeholder-image.png");
    const [isLoading, setisLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [caption, setCaption] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const handleUpload = async () => {
            setError("");
            if (!file) {
                return;
            }
            const maxSize = 1024 * 1024;

            if (file.size >= maxSize) {
                setError("Max file size is 1 MB");
                setFile(null);
                return;
            }

            const checkDimensions = new Promise((resolve, reject) => {
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                    if (img.width / img.height >= 2) {
                        reject(
                            new Error(
                                "Image too wide, please crop image first."
                            )
                        );
                        return;
                    }
                    if (img.height / img.width >= 2) {
                        reject(
                            new Error(
                                "Image too tall, please crop image first."
                            )
                        );
                        return;
                    }
                    resolve();
                };
            });

            try {
                await checkDimensions;
            } catch (err) {
                console.log(err);
                setError(err.message);
                return;
            }

            const formData = new FormData();
            formData.append("image", file);
            if (!imageUploading) {
                try {
                    setImageUploading(true);
                    const res = await api.post("/posts/upload", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                    setFilePath(res.data.filePath);
                } catch (err) {
                    console.log("Error uploading image.");
                } finally {
                    setError("");
                    setImageUploading(false);
                }
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
        if (imageUploading) {
            setError("Uploading image please wait.");
            return;
        }
        if (!isLoading) {
            try {
                setisLoading(true);
                const res = await api.post("/posts/create", {
                    caption: caption,
                    filePath: filePath,
                });
                navigate("/");
            } catch (err) {
                setError("Upload Failed.");
            } finally {
                setisLoading(false);
            }
        }
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar username={props.username} userId={props.userId} />
            <div className="md:w-[80%] w-[85%] md:ml-[20%] ml-[15%] min-h-[100vh] flex flex-col items-center overflow-y-auto">
                <div className="h-[14vh] flex flex-row justify-center items-center w-full">
                    <h1 className="text-2xl font-bold dark:text-gray-100">
                        Create Post
                    </h1>
                </div>
                <div className="w-full flex xl:flex-row xl:items-center xl:justify-center h-[86vh] flex-col justify-start items-center">
                    <div className="p-10 md:px-20 mx-auto">
                        <input
                            id="fileUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setFile(e.target.files[0])}
                            className="hidden"
                        />

                        <label
                            htmlFor="fileUpload"
                            className="2xl:w-[50vh] 2xl:h-[50vh] w-40 h-40 xs:w-60 xs:h-60 md:w-80 md:h-80 border-2 border-dashed border-gray-400 rounded-lg bg-cover bg-center flex items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-100/20 transition relative bg-gray-200"
                            style={{
                                backgroundImage: file
                                    ? `url(${uploadsPath}${filePath})`
                                    : `url(${filePath})`,
                            }}
                        />
                    </div>
                    <div className="xl:w-[50%] w-[90%] p-10 xl:px-20 md:w-[70%] flex items-center justify-center">
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
