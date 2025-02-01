import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostData } from '../../types/postTypes.ts';
import postService from '../../Services/postsService';
import commentsService from '../../Services/commentsService';
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
    const [commentsCount, setCommentsCount] = useState(0);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const navigate = useNavigate();

    const fetchCommentsCount = async () => {
        try {
            const comments = await commentsService.getCommentsByPost(post._id!);
            setCommentsCount(comments.length);
        } catch (err) {
            console.error(`Error fetching comments for post ${post._id}:`, err);
        }
    };

    useEffect(() => {
        if (currentUser) {
            setIsLiked(post.likes.includes(currentUser._id));
        }
    }, [currentUser, post]);

    useEffect(() => {
        if (post._id) {
            fetchCommentsCount();
        }
    }, [post._id]);

    const handleLike = async () => {
        if (currentUser) {
            try {
                const newLikeState = !isLiked;
                setIsLiked(newLikeState);
                const updatedPost = {
                    ...post,
                    likes: newLikeState ? [...post.likes, currentUser._id] : post.likes.filter(id => id !== currentUser._id),
                };
                if (setUserPosts) {
                    setUserPosts((prevPosts) =>
                        prevPosts.map((p) => (p._id === post._id ? updatedPost : p))
                    );
                }
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

    const closeModal = async () => {
        setShowCommentsModal(false);
        await fetchCommentsCount();
    };

    const handleEdit = () => {
        navigate(`/edit-post/${post._id}`);
    };

    const handleDelete = async () => {
        try {
            await postService.deletePost(post._id!);
            // Update the posts list after deletion
            if (setUserPosts) {
                setUserPosts((prevPosts) => prevPosts.filter((p) => p._id !== post._id));
            }
            alert("Post deleted successfully.");
        } catch (err) {
            console.error("Error deleting post:", err);
            alert("Failed to delete the post.");
        }
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
                                    onClick={handleEdit}
                                >
                                    <i
                                        className="bi bi-pencil-square"
                                        style={{ fontSize: "1.5rem", cursor: "pointer" }}
                                    ></i>
                                </button>
                                <button
                                    className="btn btn-link text-danger p-0 m-0"
                                    onClick={handleDelete}
                                >
                                    <i
                                        className="bi bi-trash"
                                        style={{ fontSize: "1.5rem", cursor: "pointer" }}
                                    ></i>
                                </button>
                            </div>
                        )}
                        <h5 className="card-title m-0">{post.title}</h5>
                    </div>
                    {post.image && (
                        <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${post.image}`}
                            alt="Post"
                            className="card-img-top"
                            style={{
                                objectFit: "cover",
                                height: "200px",
                            }}
                        />
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
                                style={{ fontSize: "1.5rem", cursor: "pointer" }}
                                onClick={handleLike}
                            />
                            <i
                                className="bi bi-chat-left-text mr-3"
                                style={{ fontSize: "1.5rem", cursor: "pointer" }}
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
