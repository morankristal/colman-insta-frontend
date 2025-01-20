import React, { useEffect, useState } from "react";
import { getAllPosts } from "../../Services/postsService.ts";
import userService from "../../Services/usersService.ts";
import { PostData } from "../../types/postTypes.ts";
import { Spinner } from "react-bootstrap";
import 'bootstrap-icons/font/bootstrap-icons.css';

const PostsLoader: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const allPosts = await getAllPosts();
                const sortedPosts = allPosts.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setPosts(sortedPosts);
                const senderIds = sortedPosts.map((post) => post.sender);
                const uniqueSenderIds = Array.from(new Set(senderIds));
                const senderNames: { [key: string]: string } = {};
                for (const senderId of uniqueSenderIds) {
                    try {
                        const user = await userService.getUserById(senderId!);
                        senderNames[senderId!] = user.username;
                    } catch (err) {
                        console.error(`Failed to fetch user for ID: ${senderId}`, err);
                    }
                }

                setUserNames(senderNames);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="container mt-4">
            {loading ? (
                <div
                    className="d-flex justify-content-center align-items-center"
                    style={{ minHeight: "60vh" }}
                >
                    <Spinner
                        animation="border"
                        role="status"
                        variant="primary"
                        style={{ width: "5rem", height: "5rem" }}
                    >
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {posts.map((post) => (
                        <div key={post._id} className="col">
                            <div className="card h-100">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="card-title m-0">{post.title}</h5>
                                </div>
                                {post.image && (
                                    <img
                                        src={`http://localhost:3000/uploads/${post.image}`}
                                        alt="Post image"
                                        className="card-img-top"
                                        style={{
                                            maxHeight: "250px",
                                            objectFit: "cover",
                                            borderTopLeftRadius: "10px",
                                            borderTopRightRadius: "10px",
                                        }}
                                    />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <p className="card-text text-muted">{post.content}</p>
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
                                            className="bi bi-chat-left-text"
                                            style={{ fontSize: "1.5rem", cursor: "pointer" }}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostsLoader;
