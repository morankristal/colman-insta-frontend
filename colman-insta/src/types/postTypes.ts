export interface PostData {
    _id?: string,
    title: string,
    content: string,
    sender?: string,
    createdAt: Date,
    likes: string[],
    image: string;
}
