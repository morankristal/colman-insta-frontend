import React, { useState, useEffect } from 'react';
import { CommentData } from '../../types/commentTypes';
import commentsService from '../../Services/commentsService';
import usersService from '../../Services/usersService';

interface CommentsListProps {
    postId: string;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId }) => {
    const [comments, setComments] = useState<(CommentData & { senderName: string; senderAvatar: string })[]>([]);

    useEffect(() => {
        const fetchCommentsWithUserNames = async () => {
            try {
                const fetchedComments = await commentsService.getCommentsByPost(postId);

                const userIds = Array.from(
                    new Set(fetchedComments
                        .map(comment => {
                            const sender = comment.sender;
                            if (typeof sender === "object" && sender !== null && "_id" in sender) {
                                return sender._id;
                            }
                            return sender as string;
                        })
                        .filter(Boolean)
                    )
                );

                const userNamesMap: { [key: string]: string } = {};
                const userAvatarsMap: { [key: string]: string } = {};

                for (const userId of userIds) {
                    const user = await usersService.getUserById(userId);
                    userNamesMap[userId] = user.username;
                    userAvatarsMap[userId] = user.profilePicture || 'default-avatar.png';
                }

                const commentsWithNames = fetchedComments.map(comment => ({
                    ...comment,
                    senderName: typeof comment.sender === 'object' && comment.sender !== null
                        ? userNamesMap[comment.sender._id]
                        : userNamesMap[comment.sender as string] || 'Unknown',
                    senderAvatar: typeof comment.sender === 'object' && comment.sender !== null
                        ? userAvatarsMap[comment.sender._id]
                        : userAvatarsMap[comment.sender as string] || 'default-avatar.png',
                }));

                setComments(commentsWithNames);
            } catch (err) {
                console.error('Error fetching comments or user names:', err);
            }
        };

        fetchCommentsWithUserNames();
    }, [postId]);

    return (
        <div className="container mt-4">
            <h3>Comments:</h3>
            <div>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment._id} className="card mb-3 shadow-sm border-light">
                            <div className="card-body d-flex align-items-start">
                                <img
                                    src={comment.senderAvatar}
                                    alt={`${comment.senderName}'s Avatar`}
                                    className="rounded-circle me-3"
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                                <div>
                                    <h5 className="card-title text-primary mb-1">{comment.senderName}</h5>
                                    <p className="card-text">{comment.content}</p>
                                    <small className="text-muted">
                                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No comments yet.</p>
                )}
            </div>
        </div>
    );
};

export default CommentsList;
