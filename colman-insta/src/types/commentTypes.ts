export interface CommentData {
    post: string;
    content: string;
    sender: SenderObject;
    createdAt: Date;
    _id: string;
}

interface SenderObject {
    _id: string;
}

