import ClickSpark from "./components/ClickSpark.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Homepage from "./pages/Homepage.jsx";
import { useEffect, useState } from "react";
import Settings from "./pages/Settings.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import Profile from "./pages/Profile.jsx";
import SavedPosts from "./pages/SavedPosts.jsx";
import Search from "./pages/Search.jsx";

function App() {
    const [darkMode, setDarkMode] = useState(false);

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
                        <ProtectedRoute>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <Homepage />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/saved"
                    element={
                        <ProtectedRoute>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <SavedPosts />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <Search />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
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
                                />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route
                    path="/reset-password"
                    element={<ResetPassword logged={true} />}
                />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/create"
                    element={
                        <ProtectedRoute>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <CreatePost />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/:username"
                    element={
                        <ProtectedRoute>
                            <ClickSpark
                                sparkColor={darkMode ? "#fff" : "#000"}
                                sparkSize={10}
                                sparkRadius={15}
                                sparkCount={8}
                                duration={400}
                            >
                                <Profile />
                            </ClickSpark>
                        </ProtectedRoute>
                    }
                />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
