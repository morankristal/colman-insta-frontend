import apiClient from "./api-client";
import { CommentData } from "../types/commentTypes.ts";

export const getAllComments = (): Promise<CommentData[]> => {
    return new Promise<CommentData[]>((resolve, reject) => {
        apiClient.get<CommentData[]>("comments")
            .then((res) => {
                const comments: CommentData[] = res.data;
                resolve(comments);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getCommentById = (id: string): Promise<CommentData> => {
    return new Promise<CommentData>((resolve, reject) => {
        apiClient.get<CommentData>(`comments/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const getCommentsByPost = (postId: string): Promise<CommentData[]> => {
    return new Promise<CommentData[]>((resolve, reject) => {
        apiClient.get<CommentData[]>(`comments/getByPost/${postId}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const createComment = (commentData: { content: string; post: string }): Promise<CommentData> => {
    return new Promise<CommentData>((resolve, reject) => {
        apiClient.post<CommentData>("comments", commentData)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const updateComment = (id: string, commentData: { content: string }): Promise<CommentData> => {
    return new Promise<CommentData>((resolve, reject) => {
        apiClient.put<CommentData>(`comments/${id}`, commentData)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const deleteComment = (id: string): Promise<CommentData> => {
    return new Promise<CommentData>((resolve, reject) => {
        apiClient.delete<CommentData>(`comments/${id}`)
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};


export default { getAllComments, getCommentById, getCommentsByPost, createComment, updateComment, deleteComment };
