import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PostData } from "../../types/postTypes.ts";
import postService from "../../Services/postsService";
import DeletePostButton from "./DeletePostButton";
import 'bootstrap-icons/font/bootstrap-icons.css';

interface PostCardProps {
    post: PostData;
    userNames: { [key: string]: string };
    currentUser: { _id: string } | null;
    setUserPosts?: React.Dispatch<React.SetStateAction<PostData[]>>;
}

const PostCard: React.FC<PostCardProps> = ({ post, userNames, currentUser, setUserPosts }) => {
    const [isLiked, setIsLiked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            setIsLiked(post.likes.includes(currentUser._id));
        }
    }, [currentUser, post]);

    const handleLike = async () => {
        if (currentUser) {
            try {
                if (isLiked) {
                    await postService.likePost(post._id!, currentUser._id);
                    setIsLiked(false);
                } else {
                    await postService.likePost(post._id!, currentUser._id);
                    setIsLiked(true);
                }

                const updatedPosts = await postService.getPostsBySender(post.sender!);
                setUserPosts && setUserPosts(updatedPosts);
            } catch (err) {
                console.error("Error handling like:", err);
            }
        }
    };

    return (
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
                                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                                ></i>
                            </button>
                            {post._id && setUserPosts && (
                                <DeletePostButton postId={post._id} setUserPosts={setUserPosts} />
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
                            style={{fontSize: "1.5rem", cursor: "pointer"}}
                            onClick={handleLike}
                        />
                    <i
                        className="bi bi-chat-left-text mr-3"
                        style={{fontSize: "1.5rem", cursor: "pointer"}}
                    ></i>
                </div>
            </div>
        </div>
</div>
)
    ;
};

export default PostCard;
