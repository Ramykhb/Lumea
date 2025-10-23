import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

function ProtectedRoute({ children, onUser }) {
    const [isReady, setIsReady] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verify = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                setIsAuthenticated(false);
                setIsReady(true);
                return;
            }

            try {
                const decoded = jwtDecode(token);
                const expired = Date.now() / 1000 > decoded.exp;

                if (expired) {
                    try {
                        const res = await api.post("/auth/refresh", {
                            accessToken: token,
                        });
                        localStorage.setItem(
                            "accessToken",
                            res.data.accessToken
                        );
                        setIsAuthenticated(true);
                    } catch {
                        setIsAuthenticated(false);
                    }
                } else {
                    try {
                        const res = await api.get("/auth/user");
                        onUser(res.data.username);
                    } catch (err) {
                        console.log(err);
                    }
                    setIsAuthenticated(true);
                }
            } catch {
                setIsAuthenticated(false);
            }

            setIsReady(true);
        };

        verify();
    }, []);

    if (!isReady) return <h1>Loading...</h1>;

    return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
