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
                console.error("Error in getting all users: ", err);
                reject(err);
            });
    });
};

export const getUserById = (id: string): Promise<UserData> => {
    console.log("Try to get user: " + id);
    return new Promise<UserData>((resolve, reject) => {
        apiClient.get<UserData>(`users/${id}`)
            .then((res) => {
                console.log("Success to get user: " + res.data._id);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in getting user: ", err);
                reject(err);
            });
    });
};

export const getUserByName = (username: string): Promise<UserData> => {
    console.log("Try to get user: " + username);
    return new Promise<UserData>((resolve, reject) => {
        apiClient.get<UserData>(`users/username/${username}`)
            .then((res) => {
                console.log("Success to get user: " + res.data.username);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in getting user: ", err);
                reject(err);
            });
    });
};

export const updateUser = (user: UserData): Promise<UserData> => {
    return new Promise<UserData>((resolve, reject) => {
        apiClient.put<UserData>(`users/${user._id}`, user)
            .then((res) => {
                console.log("Success to update user: ", res);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in updating user: ", err);
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
                console.error("Error in deleting user: ", err);
                reject(err);
            });
    });
};

export default { getAllUsers, getUserById,getUserByName, updateUser, deleteUser };
