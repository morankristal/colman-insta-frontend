import React, { useState } from 'react';
import { deleteComment } from '../../Services/commentsService';

interface DeleteCommentButtonProps {
    commentId: string;
    onDeleteSuccess: () => void;
}

const DeleteCommentButton: React.FC<DeleteCommentButtonProps> = ({ commentId, onDeleteSuccess }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                setIsDeleting(true);
                await deleteComment(commentId);
                onDeleteSuccess();
            } catch (error) {
                alert('Failed to delete the comment. Please try again. error: ' + error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            className="btn btn-outline-danger btn-sm ms-2"
            disabled={isDeleting}
        >
            {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
    );
};

export default DeleteCommentButton;
