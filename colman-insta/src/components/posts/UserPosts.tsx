import React, { useEffect, useState } from "react";
import postService from "../../Services/postsService";
import userService from "../../Services/usersService";
import { PostData } from "../../types/postTypes.ts";
import { useNavigate } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import DeletePostButton from "./DeletePostButton";
import {jwtDecode} from "jwt-decode";

interface UserPostsProps {
    userId: string;
}

interface DecodedToken {
    _id: string;
    exp: number;
}

const UserPosts: React.FC<UserPostsProps> = ({ userId }) => {
    const [userPosts, setUserPosts] = useState<PostData[]>([]);
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

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

    const currentUser = getCurrentUserFromCookie();

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const posts = await postService.getPostsBySender(userId);
                setUserPosts(posts);

                const senderIds = posts.map((post) => post.sender);
                const uniqueSenderIds = Array.from(new Set(senderIds));

                const senderNames: { [key: string]: string } = {};
                for (const senderId of uniqueSenderIds) {
                    const user = await userService.getUserById(senderId!);
                    senderNames[senderId!] = user.username;
                }

                setUserNames(senderNames);
            } catch (err) {
                setError("Failed to fetch user posts or user names.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [userId]);

    if (loading) {
        return <p>Loading posts...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="container mt-4" style={{ paddingBottom: "30px" }}>
            {userPosts.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {userPosts.map((post) => (
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
                                            {post._id && (
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
                                            className="bi bi-heart me-3"
                                            style={{ fontSize: "1.5rem", cursor: "pointer" }}
                                        ></i>
                                        <i
                                            className="bi bi-chat-left-text mr-3"
                                            style={{ fontSize: "1.5rem", cursor: "pointer" }}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No posts found for this user.</p>
            )}
        </div>
    );
};

export default UserPosts;
