import React, { useState } from 'react';
import { CommentData } from '../../types/commentTypes';
import EditComment from './EditComment';
import DeleteCommentButton from './DeleteCommentButton';

interface CommentItemProps {
    comment: CommentData & { senderName: string; senderAvatar: string };
    onUpdate: (updatedComment: CommentData) => void;
    onDelete: (commentId: string) => void;
    canEdit: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate, onDelete, canEdit }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (updatedComment: CommentData) => {
        onUpdate(updatedComment);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    return (
        <div className="card mb-3 shadow-sm border-light">
            <div className="card-body d-flex align-items-start">
                <img
                    src={comment.senderAvatar}
                    alt={`${comment.senderName}'s Avatar`}
                    className="rounded-circle me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
                <div>
                    <h5 className="card-title text-primary mb-1">{comment.senderName}</h5>
                    {!isEditing ? (
                        <>
                            <p className="card-text">{comment.content}</p>
                            <small className="text-muted">
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </small>
                            {canEdit && (
                                <div className="mt-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn btn-outline-primary btn-sm"
                                    >
                                        Edit
                                    </button>
                                    <DeleteCommentButton
                                        commentId={comment._id}
                                        onDeleteSuccess={() => onDelete(comment._id)}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <EditComment
                            comment={comment}
                            onSave={handleSave}
                            onCancel={handleCancel}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentItem;
