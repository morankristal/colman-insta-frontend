import React, { useState } from 'react';
import commentService from '../../Services/commentsService';
import { CommentData } from '../../types/commentTypes';

interface AddCommentFormProps {
    postId: string;
    onCommentAdded: (newComment: CommentData) => void;
}

const AddCommentForm: React.FC<AddCommentFormProps> = ({ postId, onCommentAdded }) => {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const newComment = await commentService.createComment({ content: commentText, post: postId });
            setCommentText('');
            onCommentAdded(newComment);
        } catch (err) {
            setError('Failed to add comment. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-3">
            <div className="form-group">
                <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isSubmitting}
                />
            </div>
            <button type="submit" className="btn btn-primary mt-2" disabled={isSubmitting}>
                {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
            {error && <div className="text-danger mt-2">{error}</div>}
        </form>
    );
};

export default AddCommentForm;
