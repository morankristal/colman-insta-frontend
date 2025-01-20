import React, { useEffect, useState } from "react";
import { getAllPosts } from "../../Services/postsService.ts";
import userService from "../../Services/usersService.ts";
import { PostData } from "../../types/postTypes.ts";
import { Spinner } from "react-bootstrap";
import PostCard from "./PostCard";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    _id: string;
    exp: number;
}

const PostsLoader: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [userNames, setUserNames] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState<boolean>(true);
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
        const currentUser = getCurrentUserFromCookie();
        setCurrentUser(currentUser);  // עדכון מצב המשתמש המחובר
    }, []);

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
                        <PostCard
                            key={post._id}
                            post={post}
                            userNames={userNames}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostsLoader;
