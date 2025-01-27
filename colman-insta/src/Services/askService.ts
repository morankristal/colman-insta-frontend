import apiClient from "./api-client";

export const askAI = (question: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        apiClient.post<string>('/ask/ai', { prompt: question })
            .then((res) => {
                resolve(res.data);
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export default { askAI };