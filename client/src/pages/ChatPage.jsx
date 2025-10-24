import api from "@/api/axios";
import SideBar from "@/components/SideBar";
import { uploadsPath } from "@/config/imagesConfig";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

const ChatPage = (props) => {
    const { username } = useParams();
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const socketRef = useRef(null);
    const navigate = useNavigate();

    const handleMessagePost = (e) => {
        e.preventDefault();
        if (newMessage.length > 0) {
            socketRef.current.emit("sendMessage", {
                senderId: props.userId,
                receiverId: profile.id,
                content: newMessage,
            });
        }
        setNewMessage("");
    };

    const fetchProfile = async () => {
        try {
            const res = await api.get(`/auth/profile/${username}`);
            setProfile(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (props.username === username) navigate("/");
        socketRef.current = io(uploadsPath);

        setIsLoading(true);
        fetchProfile();

        socketRef.current.on("messages", (msgs) => {
            setMessages(msgs);
            setIsLoading(false);
        });

        socketRef.current.on("messageDelivered", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        socketRef.current.on("receiveMessage", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    useEffect(() => {
        if (profile?.id && props.userId) {
            socketRef.current.emit("join", props.userId, profile.id);
        }
    }, [profile]);

    return (
        <div className="w-full flex flex-row h-auto bg-primary-light overflow-hidden dark:bg-primary-dark">
            <SideBar username={props.username} userId={props.userId} />
            <div className="md:w-[80%] w-[85%] md:ml-[20%] ml-[15%] h-[100dvh] flex flex-col relative md:px-10 px-3">
                <div className="w-full md:px-5 px-2 py-2 h-20 flex items-center mb-5 border-b-[1px] border-gray-200 dark:border-border-dark">
                    <img
                        src={`${uploadsPath}${profile.profileImage}`}
                        className="w-[40px] h-[40px] my-auto rounded-full mr-5"
                    />
                    <p className="dark:text-white">{username}</p>
                </div>

                <div className="flex-1 overflow-y-auto flex flex-col space-y-3 p-4">
                    <div className="w-full py-1 mb-5">
                        <p className="dark:text-gray-200 text-gray-500 text-center text-sm md:text-base">
                            Messages are automatically deleted after being read
                        </p>
                    </div>

                    {messages.length > 0 ? (
                        messages.map((message) =>
                            message.senderId == profile.id ? (
                                <div
                                    key={message.id}
                                    className="relative max-w-[70%] p-3 rounded-2xl bg-gray-300 text-gray-900 self-start before:content-[''] before:absolute before:left-[-6px] before:top-3 before:border-y-[6px] before:border-r-[6px] before:border-y-transparent before:border-r-gray-300"
                                >
                                    {message.content}
                                </div>
                            ) : (
                                <div
                                    key={message.id}
                                    className="relative max-w-[70%] p-3 rounded-2xl bg-yellow-600 text-white self-end before:content-[''] before:absolute before:right-[-6px] before:top-3 before:border-y-[6px] before:border-l-[6px] before:border-y-transparent before:border-l-yellow-600"
                                >
                                    {message.content}
                                </div>
                            )
                        )
                    ) : (
                        <div className="w-full h-full flex justify-center items-center">
                            <h3 className="text-center md:text-sm text-xs text-gray-500 dark:text-gray-100">
                                {isLoading
                                    ? "Fetching unread messages."
                                    : "No unread messages available,"}
                            </h3>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="w-full">
                    <form className="bg-primary-light dark:bg-primary-dark w-full h-12 flex items-center justify-around border-t-[1px] border-gray-200 dark:border-border-dark">
                        <input
                            className="bg-transparent focus:border-none focus:outline-none md:text-sm dark:caret-white dark:placeholder-gray-300 dark:text-gray-100 text-xs w-[80%]"
                            placeholder="Enter text..."
                            onChange={(e) => setNewMessage(e.target.value)}
                            value={newMessage}
                        />
                        <button onClick={handleMessagePost}>
                            <div className="rounded-full bg-yellow-400 hover:bg-yellow-500 w-9 h-9 flex justify-center items-center">
                                <FontAwesomeIcon icon={faArrowRight} />
                            </div>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
