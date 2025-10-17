import api from "@/api/axios";
import SideBar from "@/components/SideBar";
import Stepper, { Step } from "@/components/Stepper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EditProfile = (props) => {
    const [file, setFile] = useState(null);
    const [bio, setBio] = useState("");
    const [name, setName] = useState("");
    const [profile, setProfile] = useState({});
    const [isPublic, setIsPublic] = useState(true);
    const [filePath, setFilePath] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            if (props.username) {
                try {
                    const res = await api.get(
                        `/auth/profile/${props.username}`
                    );
                    setProfile(res.data);
                } catch (err) {
                    console.log(err);
                }
            }
        };
        fetchProfile();
    }, [props.username]);

    useEffect(() => {
        if (profile && Object.keys(profile).length > 0) {
            setFilePath(profile.profileImage);
            setName(profile.name);
            setIsPublic(profile.isPublic);
            setBio(profile.bio);
        }
    }, [profile]);

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

    const handleSaveChanges = async () => {
        try {
            const res = await api.put("/auth/editProfile", {
                name: name,
                profileImage: filePath,
                bio: bio,
                isPublic: isPublic,
            });
            navigate(`/profile/${props.username}`);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar onUser={props.onUser} username={props.username} />
            <div className="w-[80%] ml-[20%] min-h-[100vh] flex items-center justify-center">
                <Stepper
                    initialStep={1}
                    onFinalStepCompleted={handleSaveChanges}
                    backButtonText="Previous"
                    nextButtonText="Next"
                >
                    <Step>
                        <h2 className="text-center text-2xl dark:text-gray-100 mb-5">
                            Full Name
                        </h2>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Full name"
                            className="w-full h-10 my-5 p-3 bg-transparent rounded-md border-gray-300 border-2 dark:border-border-dark focus:outline-none dark:caret-white dark:placeholder-gray-300 dark:text-gray-100"
                        />
                    </Step>
                    <Step>
                        <h2 className="text-center text-2xl dark:text-gray-100">
                            Select a profile picture.
                        </h2>
                        <div className="w-[100%] p-5 mt-3">
                            <input
                                id="fileUpload"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files[0])}
                                className="hidden"
                            />

                            <label
                                htmlFor="fileUpload"
                                className="w-[25vh] h-[25vh] border-2 border-dashed border-gray-400 rounded-full bg-cover bg-center flex items-center justify-center cursor-pointer hover:border-gray-500 hover:bg-gray-100/20 transition relative bg-gray-200 mx-auto"
                                style={{
                                    backgroundImage: `url(http://localhost:3000${filePath})`,
                                }}
                            />
                        </div>
                    </Step>
                    <Step>
                        <h2 className="text-center text-2xl dark:text-gray-100 mb-5">
                            Enter a bio.
                        </h2>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Enter a short bio."
                            className="w-full min-h-[120px] my-5 p-3 bg-transparent rounded-md border-gray-300 border-2 dark:border-border-dark focus:outline-none dark:caret-white dark:placeholder-gray-300 dark:text-gray-100"
                        ></textarea>
                    </Step>
                    <Step>
                        <h2 className="text-center text-2xl dark:text-gray-100">
                            Account Privacy
                        </h2>
                        <div className="flex justify-between w-full my-5 ml-[5%] pt-10">
                            <p className="font-bold dark:text-white">
                                Private Account
                            </p>
                            <div
                                onClick={() => {
                                    setIsPublic(!isPublic);
                                }}
                                className={`w-14 h-8 flex mr-5 items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                                    !isPublic ? "bg-green-500" : "bg-gray-300"
                                }`}
                            >
                                <div
                                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                                        !isPublic
                                            ? "translate-x-6"
                                            : "translate-x-0"
                                    }`}
                                />
                            </div>
                        </div>
                    </Step>
                    <Step>
                        <h2 className="text-center text-2xl dark:text-gray-100">
                            Save Changes?
                        </h2>
                    </Step>
                </Stepper>
                ;
            </div>
        </div>
    );
};

export default EditProfile;
