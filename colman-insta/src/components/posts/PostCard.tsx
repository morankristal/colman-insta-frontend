import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostData } from '../../types/postTypes.ts';
import postService from '../../Services/postsService';
import commentsService from '../../Services/commentsService';
import DeletePostButton from './DeletePostButton';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Modal } from "react-bootstrap";
import PostCommentsPage from '../../pages/PostCommentsPage.tsx';

interface PostCardProps {
    post: PostData;
    userNames: { [key: string]: string };
    currentUser: { _id: string } | null;
    setUserPosts?: React.Dispatch<React.SetStateAction<PostData[]>>;
}

const PostCard: React.FC<PostCardProps> = ({ post, userNames, currentUser, setUserPosts }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [commentsCount, setCommentsCount] = useState(0); // State for comments count
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            setIsLiked(post.likes.includes(currentUser._id));
        }
    }, [currentUser, post]);

    useEffect(() => {
        const fetchCommentsCount = async () => {
            try {
                const comments = await commentsService.getCommentsByPost(post._id!);
                setCommentsCount(comments.length); // Set comments count
            } catch (err) {
                console.error(`Error fetching comments for post ${post._id}:`, err);
                setCommentsCount(0);
            }
        };

        if (post._id) {
            fetchCommentsCount();
        }
    }, [post._id]);

    const handleLike = async () => {
        if (currentUser) {
            try {
                const newLikeState = !isLiked;
                setIsLiked(newLikeState);
                const updatedPost = { ...post, likes: newLikeState ? [...post.likes, currentUser._id] : post.likes.filter(id => id !== currentUser._id) };
                setUserPosts && setUserPosts((prevPosts) => {
                    return prevPosts.map((p) => p._id === post._id ? updatedPost : p);
                });
                await postService.likePost(post._id!, currentUser._id);
            } catch (err) {
                console.error("Error handling like:", err);
                setIsLiked(isLiked);
            }
        }
    };

    const handleCommentsClick = () => {
        setShowCommentsModal(true);
    };

    const closeModal = () => {
        setShowCommentsModal(false);
    };

    return (
        <>
            <div key={post._id} className="col">
                <div className="card h-100">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        {currentUser && currentUser._id === post.sender && (
                            <div>
                                <button
                                    className="btn btn-link text-primary p-0 m-0"
                                    onClick={() => navigate(`/edit-post/${post._id}`)}
                                >
                                    <i
                                        className="bi bi-pencil-square"
                                        style={{fontSize: "1.5rem", cursor: "pointer"}}
                                    ></i>
                                </button>
                                {post._id && setUserPosts && (
                                    <DeletePostButton postId={post._id} setUserPosts={setUserPosts}/>
                                )}
                            </div>
                        )}
                        <h5 className="card-title m-0">{post.title}</h5>
                    </div>
                    {post.image && (
                        <img
                            src={`http://localhost:3000/uploads/${post.image}`}
                            alt="Post"
                            className="card-img-top"
                            style={{
                                objectFit: "cover",
                                height: "200px",
                            }}/>
                    )}
                    <div className="card-body">
                        <p className="card-text">{post.content}</p>
                        <p className="card-text">
                            <small className="text-muted">
                                Created By: {userNames[post.sender!] || "Unknown"}
                            </small>
                        </p>
                    </div>
                    <div className="card-footer d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Created at: {new Date(post.createdAt).toLocaleString()}
                        </small>
                        <div>
                            <i
                                className={`bi ${isLiked ? 'bi-heart-fill text-danger' : 'bi-heart'} me-3`}
                                style={{fontSize: "1.5rem", cursor: "pointer"}}
                                onClick={handleLike}/>
                            <i
                                className="bi bi-chat-left-text mr-3"
                                style={{fontSize: "1.5rem", cursor: "pointer"}}
                                onClick={handleCommentsClick}
                            >
                            </i> {commentsCount}
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showCommentsModal} onHide={closeModal} size="lg" centered>
                <Modal.Header closeButton>
                </Modal.Header>
                <Modal.Body>
                    {post._id ? (
                        <PostCommentsPage postId={post._id} />
                    ) : (
                        <p>Post ID is missing!</p>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default PostCard;
