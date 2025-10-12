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
                            <Homepage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/saved"
                    element={
                        <ProtectedRoute>
                            <SavedPosts />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <Settings
                            onToggleDarkMode={toggleDarkMode}
                            darkModeOn={darkMode}
                        />
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
                            <CreatePost />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile/:username"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
