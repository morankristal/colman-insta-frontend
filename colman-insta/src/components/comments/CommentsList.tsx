import React, { useEffect, useState } from 'react';
import { CommentData } from '../../types/commentTypes';
import usersService from '../../Services/usersService';
import CommentItem from './commentItem';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    _id: string;
}

interface CommentsListProps {
    comments: CommentData[];
    onUpdateComment: () => void;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, onUpdateComment }) => {
    const [commentsWithUserData, setCommentsWithUserData] = useState<(CommentData & { senderName: string; senderAvatar: string })[]>([]);
    const [currentUser, setCurrentUser] = useState<{ _id: string } | null>(null);

    const getCurrentUserFromCookie = () => {
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find((cookie) => cookie.startsWith('accessToken='));
        if (!tokenCookie) return null;

        const token = tokenCookie.split('=')[1];
        try {
            return jwtDecode<DecodedToken>(token);
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    };

    useEffect(() => {
        const user = getCurrentUserFromCookie();
        setCurrentUser(user);
    }, []);

    useEffect(() => {
        const enrichCommentsWithUserData = async () => {
            try {
                const userIds = Array.from(new Set(comments.map((comment) => {
                    const sender = comment.sender;
                    return typeof sender === 'object' && sender !== null && '_id' in sender
                        ? sender._id
                        : sender as string;
                })));

                const userNamesMap: { [key: string]: string } = {};
                const userAvatarsMap: { [key: string]: string } = {};

                for (const userId of userIds) {
                    const user = await usersService.getUserById(userId);
                    userNamesMap[userId] = user.username;
                    userAvatarsMap[userId] = user.profilePicture || 'default-avatar.png';
                }

                const enrichedComments = comments.map((comment) => ({
                    ...comment,
                    senderName: typeof comment.sender === 'object' && comment.sender !== null
                        ? userNamesMap[comment.sender._id]
                        : userNamesMap[comment.sender as string] || 'Unknown',
                    senderAvatar: typeof comment.sender === 'object' && comment.sender !== null
                        ? userAvatarsMap[comment.sender._id]
                        : userAvatarsMap[comment.sender as string] || 'default-avatar.png',
                }));

                setCommentsWithUserData(enrichedComments);
            } catch (err) {
                console.error('Error enriching comments with user data:', err);
            }
        };

        enrichCommentsWithUserData();
    }, [comments]);

    return (
        <div className="container mt-4">
            <div className="comments-container" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {commentsWithUserData.length > 0 ? (
                    commentsWithUserData.map((comment) => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            onUpdate={onUpdateComment}
                            onDelete={onUpdateComment}
                            canEdit={currentUser?._id === comment.sender._id}
                        />
                    ))
                ) : (
                    <div className="alert alert-info">No comments yet.</div>
                )}
            </div>
        </div>
    );
};

export default CommentsList;
