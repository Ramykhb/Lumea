import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState("");
    const navigate = useNavigate();

    const handleUpload = async () => {
        if (!file) return alert("Select an image first");

        const formData = new FormData();
        formData.append("image", file); // file input
        formData.append("caption", caption); // text input

        try {
            const res = await api.post(
                "http://localhost:3000/api/v1/posts/upload",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            navigate("/");
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
            />
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={handleUpload}>Upload Post</button>
        </div>
    );
}

export default CreatePost;
