// src/pages/PostCommentsPage.tsx

import React, { useState, useEffect } from 'react';
import { PostData } from '../types/postTypes.ts';
import postService from '../Services/postsService';
import CommentsList from '../components/comments/CommentsList.tsx';

interface PostCommentsPageProps {
    postId: string;
}

const PostCommentsPage: React.FC<PostCommentsPageProps> = ({ postId }) => {
    const [post, setPost] = useState<PostData | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const fetchedPost = await postService.getPostById(postId);
                setPost(fetchedPost);
            } catch (err) {
                console.error("Error fetching post:", err);
            }
        };

        fetchPost();
    }, [postId]);

    return (
        <div>
            {post ? (
                <div>
                    <CommentsList postId={postId} />
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PostCommentsPage;
