import { backendPath } from "@/config/backConfig";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = axios.create({
    baseURL: `${backendPath}/api/v1`,
    withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    if (token) {
        try {
            const decoded = jwtDecode(token);
            const expiryDate = new Date(decoded.exp * 1000);

            const isExpired = Date.now() / 1000 > decoded.exp;

            if (isExpired && !isRefreshing) {
                isRefreshing = true;

                try {
                    const res = await axios.post(
                        `${backendPath}/api/v1/auth/refresh`,
                        { accessToken: token, refreshToken: refresh },
                        { withCredentials: true }
                    );

                    const newToken = res.data.accessToken;
                    localStorage.setItem("accessToken", newToken);
                    api.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    config.headers.Authorization = `Bearer ${newToken}`;
                } catch (err) {
                    processQueue(err, null);
                    localStorage.removeItem("accessToken");
                    window.location.href = "/login";
                } finally {
                    isRefreshing = false;
                }
            } else if (isExpired && isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token) => {
                            config.headers.Authorization = `Bearer ${token}`;
                            resolve(config);
                        },
                        reject: (err) => reject(err),
                    });
                });
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("accessToken");
        }
        return Promise.reject(error);
    }
);

export default api;
