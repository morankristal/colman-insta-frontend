import React, { useState } from 'react';
import { CommentData } from '../../types/commentTypes';
import commentsService from '../../Services/commentsService';

interface EditCommentProps {
    comment: CommentData & { senderName: string; senderAvatar: string };
    onSave: (updatedComment: CommentData) => void;
    onCancel: () => void;
}

const EditComment: React.FC<EditCommentProps> = ({ comment, onSave, onCancel }) => {
    const [newContent, setNewContent] = useState(comment.content);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);

        try {
            const updatedComment = await commentsService.updateComment(comment._id, { content: newContent });
            onSave(updatedComment);
            onCancel();
        } catch {
            setError('Failed to update the comment');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="card mb-3 shadow-sm">
            <div className="card-body">
                <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="form-control mb-3"
                    rows={3}
                />
                {error && <div className="alert alert-danger">{error}</div>}
                <div>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary me-2"
                        disabled={isSaving}
                        style={{ cursor: 'pointer' }}
                    >
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                        onClick={onCancel}
                        className="btn btn-secondary"
                        style={{ cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditComment;
