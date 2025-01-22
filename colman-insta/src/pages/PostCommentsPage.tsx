import React, { useState, useEffect } from 'react';
import { PostData } from '../types/postTypes';
import { CommentData } from '../types/commentTypes';
import postService from '../Services/postsService';
import commentService from '../Services/commentsService';
import CommentsList from '../components/comments/CommentsList';
import AddCommentForm from '../components/comments/AddCommentForm';

interface PostCommentsPageProps {
    postId: string;
}

const PostCommentsPage: React.FC<PostCommentsPageProps> = ({ postId }) => {
    const [post, setPost] = useState<PostData | null>(null);
    const [comments, setComments] = useState<CommentData[]>([]);

    const fetchPost = async () => {
        try {
            const fetchedPost = await postService.getPostById(postId);
            setPost(fetchedPost);
        } catch (err) {
            console.error('Error fetching post:', err);
        }
    };

    const fetchComments = async () => {
        try {
            const fetchedComments = await commentService.getCommentsByPost(postId);
            setComments(fetchedComments);
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId]);

    return (
        <div className="container mt-4">
            {post ? (
                <>
                    <h2 className="mb-3">{post.title}</h2>
                    <p>{post.content}</p>
                    <div className="mt-4">
                        <h5>Comments</h5>
                        <CommentsList comments={comments} onUpdateComment={fetchComments} />
                    </div>
                    <div className="mt-4">
                        <AddCommentForm postId={postId} onCommentAdded={fetchComments} />
                    </div>
                </>
            ) : (
                <p>Loading post...</p>
            )}
        </div>
    );
};

export default PostCommentsPage;
