import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import SideBar from "./components/SideBar.jsx";
import Post from "./components/Post.jsx";
import Homepage from "./pages/Homepage.jsx";
import { useEffect, useState } from "react";
import Settings from "./pages/Settings.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

function App() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        console.log("CLICKED");
        setDarkMode(!darkMode);
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
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
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
