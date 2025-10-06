import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const auth = async () => {
        const token = localStorage.getItem("accessToken");

        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        const decodedToken = jwtDecode(token, { header: false });
        const expirationDate = decodedToken.exp;

        if (Date.now() / 1000 > expirationDate) {
            await refresh();
        } else {
            setIsAuthenticated(true);
        }
    };

    const refresh = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            const response = await api.post("/users/refresh", {
                accessToken: accessToken,
            });

            if (response.status == 200) {
                localStorage.setItem("accessToken", response.data.accessToken);
                setIsAuthenticated(true);
                return;
            } else {
                setIsAuthenticated(false);
                return;
            }
        } catch (error) {
            setIsAuthenticated(false);
            return;
        }
    };

    useEffect(() => {
        auth().catch(() => {
            setIsAuthenticated(false);
        });
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
