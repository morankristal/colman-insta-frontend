import apiClient from "./api-client";
import { UserData } from "../types/userTypes.ts"  // הנחה שמבנה ה-UserData מוגדר בקובץ DataStructure

export const getAllUsers = (): Promise<UserData[]> => {
    return new Promise<UserData[]>((resolve, reject) => {
        apiClient.get<UserData[]>("users")
            .then((res) => {
                const users: UserData[] = res.data;
                resolve(users);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getUserById = (id: string): Promise<UserData> => {
    return new Promise<UserData>((resolve, reject) => {
        apiClient.get<UserData>(`users/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getUserByName = (username: string): Promise<UserData> => {
    return new Promise<UserData>((resolve, reject) => {
        apiClient.get<UserData>(`users/username/${username}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const searchUsers = (username: string): Promise<string[]> => {
    return new Promise<string[]>((resolve, reject) => {
        apiClient.get<UserData[]>(`users/search/${username}`)
            .then((res) => {
                const usernames = res.data.map(user => user.username);
                resolve(usernames);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const updateUser = (user: UserData): Promise<UserData> => {
    return new Promise<UserData>((resolve, reject) => {
        apiClient.put<UserData>(`users/${user._id}`, user)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const deleteUser = (id: string): Promise<UserData> => {
    return new Promise<UserData>((resolve, reject) => {
        apiClient.delete<UserData>(`users/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default { getAllUsers, getUserById, getUserByName, searchUsers, updateUser, deleteUser };
