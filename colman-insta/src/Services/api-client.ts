import axios from "axios";
import Cookies from "js-cookie";
import autoService from "./authService.ts";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
function backEnv(): string {
    return process.env.NODE_ENV = backendUrl;
}

const apiClient = axios.create({
    baseURL: backEnv(),
    withCredentials: true,
});
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = Cookies.get("refreshToken");
                if (!refreshToken) {
                    return Promise.reject("No refresh token found");
                }
                const newTokens = await autoService.refresh(refreshToken);
                Cookies.set("accessToken", newTokens.accessToken);
                return apiClient(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);
export default apiClient;
