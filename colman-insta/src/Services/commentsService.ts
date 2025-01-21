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
                console.error("Error in getting all comments: ", err);
                reject(err);
            });
    });
};

export const getCommentById = (id: string): Promise<CommentData> => {
    console.log("Try to get comment: " + id);
    return new Promise<CommentData>((resolve, reject) => {
        apiClient.get<CommentData>(`comments/${id}`)
            .then((res) => {
                console.log("Success to get comment: " + res.data._id);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in getting comment: ", err);
                reject(err);
            });
    });
};

export const getCommentsByPost = (postId: string): Promise<CommentData[]> => {
    console.log("Try to get comments by post: " + postId);
    return new Promise<CommentData[]>((resolve, reject) => {
        apiClient.get<CommentData[]>(`comments/getByPost/${postId}`)
            .then((res) => {
                console.log("Success to get comments by post: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in getting comments by post: ", err);
                reject(err);
            });
    });
};

export const createComment = (commentData: { content: string; postId: string }): Promise<CommentData> => {
    return new Promise<CommentData>((resolve, reject) => {
        apiClient.post<CommentData>("comments", commentData)
            .then((res) => {
                console.log("Success to create comment: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in creating comment: ", err);
                reject(err);
            });
    });
};

export const updateComment = (id: string, commentData: { content: string }): Promise<CommentData> => {
    return new Promise<CommentData>((resolve, reject) => {
        apiClient.put<CommentData>(`comments/${id}`, commentData)
            .then((res) => {
                console.log("Success to update comment: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in updating comment: ", err);
                reject(err);
            });
    });
};

export const deleteComment = (id: string): Promise<CommentData> => {
    return new Promise<CommentData>((resolve, reject) => {
        apiClient.delete<CommentData>(`comments/${id}`)
            .then((res) => {
                console.log("Success to delete comment: ", res.data);
                resolve(res.data);
            })
            .catch((err) => {
                console.error("Error in deleting comment: ", err);
                reject(err);
            });
    });
};


export default { getAllComments, getCommentById, getCommentsByPost, createComment, updateComment, deleteComment };
