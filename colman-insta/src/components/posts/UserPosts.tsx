import React, { useEffect, useState } from "react";
import postService from "../../Services/postsService";
import userService from "../../Services/usersService";
import { PostData } from "../../types/postTypes.ts";
import { jwtDecode } from "jwt-decode";
import PostCard from "./PostCard";

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

            } catch (err: any) {
                if (err.response && err.response.status === 404) {
                    setUserPosts([]); 
                } else {
                    setError("Failed to fetch user posts or user names.");
                    console.error(err);
                }
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
                        <PostCard
                            key={post._id}
                            post={post}
                            userNames={userNames}
                            currentUser={currentUser}
                            setUserPosts={setUserPosts}
                        />
                    ))}
                </div>
            ) : (
                <p>No posts found for this user.</p>
            )}
        </div>
    );
};

export default UserPosts;
