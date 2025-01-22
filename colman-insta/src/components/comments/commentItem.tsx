import React, { useState } from 'react';
import { CommentData } from '../../types/commentTypes';
import EditComment from './EditComment';

interface CommentItemProps {
    comment: CommentData & { senderName: string; senderAvatar: string };
    onUpdate: (updatedComment: CommentData) => void;
    canEdit: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate, canEdit }) => {
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
                            {canEdit && !isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-outline-primary btn-sm ms-2"
                                >
                                    Edit
                                </button>
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
