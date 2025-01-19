import React, { useEffect, useState } from "react";
import postService from "../../Services/postsService";
import {PostData} from "../../types/postTypes.ts";

interface UserPostsProps {
    userId: string;
}

const UserPosts: React.FC<UserPostsProps> = ({ userId }) => {
    const [userPosts, setUserPosts] = useState<PostData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const posts = await postService.getPostsBySender(userId);
                setUserPosts(posts);
            } catch (err) {
                setError("Failed to fetch user posts.");
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
        <div>
            {userPosts.length > 0 ? (
                <div className="list-group">
                    {userPosts.map((post: any) => (
                        <div key={post._id} className="list-group-item">
                            <h5>{post.title}</h5>
                            <p>{post.content}</p>
                            {post.image && (
                                <img
                                    src={`http://localhost:3000/uploads/${post.image}`}
                                    alt="Post"
                                    className="img-fluid"
                                    style={{
                                        maxHeight: "400px",
                                        objectFit: "cover",
                                        width: "100%",
                                        borderRadius: "10px",
                                    }}
                                />
                            )}
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
