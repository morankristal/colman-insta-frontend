import React, { useEffect, useState } from "react";
import { getAllPosts } from "../Services/postsService"; // הייבוא של שירות הפוסטים
import { PostData } from "../types/postTypes"; // הייבוא של סוג הפוסט
import { Spinner } from "react-bootstrap"; // הייבוא של כפתור טעינה מבוטסראפ

const PostsLoader: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const allPosts = await getAllPosts();
                // מיין את הפוסטים לפי תאריך חדש לישן
                const sortedPosts = allPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setPosts(sortedPosts);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="container mt-4">
            {loading ? (
                // הצגת אנימציית טעינה
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
                    <Spinner animation="border" role="status" variant="primary" style={{ width: "5rem", height: "5rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                // הצגת הפוסטים לאחר טעינה
                <div>
                    <h3 className="mb-4">All Posts</h3>
                    <div className="list-group">
                        {posts.map((post) => (
                            <div key={post._id} className="list-group-item p-4 mb-4" style={{ borderRadius: "10px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
                                {/* תמונה */}
                                {post.image && (
                                    <div className="mb-3">
                                        <img
                                            src={`http://localhost:3000/uploads/${post.image}`}
                                            alt="Post image"
                                            className="img-fluid rounded"
                                            style={{ maxHeight: "400px", objectFit: "cover", width: "100%", borderRadius: "10px" }}
                                        />
                                    </div>
                                )}

                                {/* כותרת */}
                                <h5 className="font-weight-bold">{post.title}</h5>

                                {/* תוכן */}
                                <p className="text-muted">{post.content}</p>

                                {/* מידע נוסף */}
                                <div className="d-flex justify-content-between align-items-center mt-2">
                                    <small className="text-muted">Created at: {new Date(post.createdAt).toLocaleString()}</small>

                                    {/* אייקונים של לייקים ותגובות */}
                                    <div>
                                        <i className="bi bi-heart mr-2" style={{ fontSize: "1.5rem", cursor: "pointer" }}></i>
                                        <i className="bi bi-chat-left-text mr-2" style={{ fontSize: "1.5rem", cursor: "pointer" }}></i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostsLoader;
