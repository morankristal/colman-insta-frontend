import apiClient from "./api-client";
import { PostData } from "../types/postTypes.ts";

export const getAllPosts = (): Promise<PostData[]> => {
    return new Promise<PostData[]>((resolve, reject) => {
        apiClient.get<PostData[]>("posts")
            .then((res) => {
                const posts: PostData[] = res.data;
                resolve(posts);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getPostById = (id: string): Promise<PostData> => {
    return new Promise<PostData>((resolve, reject) => {
        apiClient.get<PostData>(`posts/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getPostsBySender = (senderId: string): Promise<PostData[]> => {
    return new Promise<PostData[]>((resolve, reject) => {
        apiClient.get<PostData[]>(`posts/getBySender/${senderId}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    resolve([]);
                } else {
                    reject(err);
                }
            });
    });
};

export const createPost = (postData: FormData): Promise<PostData> => {
    return new Promise<PostData>((resolve, reject) => {
        apiClient.post<PostData>("posts", postData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const updatePost = (_id: string, post: FormData): Promise<PostData> => {
    return new Promise<PostData>((resolve, reject) => {
        apiClient.put<PostData>(`posts/${_id}`, post)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const deletePost = (id: string): Promise<PostData> => {
    return new Promise<PostData>((resolve, reject) => {
        apiClient.delete<PostData>(`posts/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
export const likePost = (postId: string, userId: string): Promise<PostData> => {
    return new Promise<PostData>((resolve, reject) => {
        apiClient.post<PostData>(`posts/${postId}/like`, { userId })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getLikedPosts = (userId: string): Promise<PostData[]> => {
    return new Promise<PostData[]>((resolve, reject) => {
        apiClient.get<PostData[]>(`posts/liked?userId=${userId}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default { getAllPosts, getPostById, getPostsBySender, createPost, updatePost, deletePost, likePost, getLikedPosts };