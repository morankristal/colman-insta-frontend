import apiClient from "./api-client";
import {TokenResponse, UserData} from "../types/userTypes.ts"


export const register = (data: UserData): Promise<UserData> => {
    return new Promise((resolve, reject) => {
        apiClient
            .post<UserData>("auth/register", data)
            .then((res) => resolve(res.data))
            .catch((err) => {
                console.error("Error in registering user: ", err);
                reject(err);
            });
    });
};

export const login = (username: string, password: string): Promise<TokenResponse> => {
    return new Promise((resolve, reject) => {
        apiClient
            .post<TokenResponse>("auth/login", { username, password }) // הוספתי withCredentials
            .then((res) => resolve(res.data))
            .catch((err) => {
                console.error("Error in logging in: ", err);
                reject(err);
            });
    });
};


export const refresh = ( refreshToken: string): Promise<TokenResponse> => {
    return new Promise((resolve, reject) => {
        apiClient
            .post<TokenResponse>("auth/refresh", refreshToken)
            .then((res) => resolve(res.data))
            .catch((err) => {
                console.error("Error in refreshing tokens: ", err);
                reject(err);
            });
    });
};

export const logout = (refreshToken: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        apiClient
            .post<void>("auth/logout", refreshToken)
            .then(() => resolve())
            .catch((err) => {
                console.error("Error in logging out: ", err);
                reject(err);
            });
    });
};

export default {
    register,
    login,
    refresh,
    logout,
};
