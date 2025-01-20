import apiClient from "./api-client";
import {PostData} from "../types/postTypes.ts";

export const getAllPosts = (): Promise<PostData[]> => {
    return new Promise<PostData[]>((resolve, reject) => {
        apiClient.get<PostData[]>("posts")
            .then((res) => {
                const posts: PostData[] = res.data;
                resolve(posts);
            })
            .catch((err) => {
                console.error("Error in getting all posts: ", err);
                reject(err);
            });
    });
};

export const getPostById = (id: string): Promise<PostData> => {
    console.log("Try to get post: " + id);
    return new Promise<PostData>((resolve, reject) => {
        apiClient.get<PostData>(`posts/${id}`)
            .then((res) => {
                console.log("Success to get post: " + res.data._id);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in getting post: ", err);
                reject(err);
            });
    });
};

export const getPostsBySender = (senderId: string): Promise<PostData[]> => {
    console.log("Try to get posts by sender: " + senderId);
    return new Promise<PostData[]>((resolve, reject) => {
        apiClient.get<PostData[]>(`posts/getBySender/${senderId}`)
            .then((res) => {
                console.log("Success to get posts by sender: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in getting posts by sender: ", err);
                reject(err);
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
                console.log("Success to create post: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in creating post: ", err);
                reject(err);
            });
    });
};

export const updatePost = (_id:string, post: FormData): Promise<PostData> => {
    return new Promise<PostData>((resolve, reject) => {
        apiClient.put<PostData>(`posts/${_id}`, post)
            .then((res) => {
                console.log("Success to update post: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in updating post: ", err);
                reject(err);
            });
    });
};

export const deletePost = (id: string): Promise<PostData> => {
    return new Promise<PostData>((resolve, reject) => {
        apiClient.delete<PostData>(`posts/${id}`)
            .then((res) => {
                console.log("Success to delete post: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in deleting post: ", err);
                reject(err);
            });
    });
};
export const likePost = (postId: string, userId: string): Promise<PostData> => {
    return new Promise<PostData>((resolve, reject) => {
        apiClient.post<PostData>(`posts/${postId}/like`, { userId })
            .then((res) => {
                console.log("Success to like/unlike post: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in liking/unliking post: ", err);
                reject(err);
            });
    });
};

export const getLikedPosts = (userId: string): Promise<PostData[]> => {
    return new Promise<PostData[]>((resolve, reject) => {
        apiClient.get<PostData[]>(`posts/liked?userId=${userId}`)
            .then((res) => {
                console.log("Success to get liked posts: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in getting liked posts: ", err);
                reject(err);
            });
    });
};

export default { getAllPosts, getPostById, getPostsBySender, createPost, updatePost, deletePost, likePost, getLikedPosts };