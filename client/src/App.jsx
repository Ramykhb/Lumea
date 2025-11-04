import ClickSpark from "./components/ClickSpark.jsx";
import { BrowserRouter, Route, Routes, Navigate, data } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Homepage from "./pages/Homepage.jsx";
import { useEffect, useState } from "react";
import Settings from "./pages/Settings.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ForgetPassword from "./pages/ForgetPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Profile from "./pages/Profile.jsx";
import SavedPosts from "./pages/SavedPosts.jsx";
import Search from "./pages/Search.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import api from "./api/axios.js";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");

    const handleUsername = async (username, id) => {
        setUsername(username);
        setUserId(id);
        try {
            const res = api.delete("/interactions/notifications");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const mode = localStorage.getItem("darkMode");
        if (mode) {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <Homepage username={username} userId={userId} />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/saved"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <SavedPosts
                                    username={username}
                                    userId={userId}
                                />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <Search username={username} userId={userId} />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <Settings
                                    onToggleDarkMode={toggleDarkMode}
                                    darkModeOn={darkMode}
                                    username={username}
                                    userId={userId}
                                />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <ChangePassword
                                    username={username}
                                    userId={userId}
                                />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route path="/forget-password" element={<ForgetPassword />} />

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />
                <Route
                    path="/login"
                    element={
                        <ClickSpark
                            sparkColor={darkMode ? "#fff" : "#000"}
                            sparkSize={10}
                            sparkRadius={15}
                            sparkCount={8}
                            duration={400}
                        >
                            <Login onAuth={handleUsername} />
                        </ClickSpark>
                    }
                />
                <Route
                    path="/create"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <CreatePost
                                    username={username}
                                    userId={userId}
                                />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/:username"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <Profile username={username} userId={userId} />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat/:username"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <ChatPage username={username} userId={userId} />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <ClickSpark
                            sparkColor={darkMode ? "#fff" : "#000"}
                            sparkSize={10}
                            sparkRadius={15}
                            sparkCount={8}
                            duration={400}
                        >
                            <Signup onAuth={handleUsername} />
                        </ClickSpark>
                    }
                />
                <Route
                    path="/editProfile"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <EditProfile
                                    username={username}
                                    userId={userId}
                                />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute onUser={handleUsername}>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <NotificationsPage
                                    username={username}
                                    userId={userId}
                                />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
