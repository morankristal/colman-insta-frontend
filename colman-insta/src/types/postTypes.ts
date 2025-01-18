export interface PostData {
    _id?: string,
    content: string,
    sender: string,
    createdAt: Date,
    likes: string[],
    image: string;
}