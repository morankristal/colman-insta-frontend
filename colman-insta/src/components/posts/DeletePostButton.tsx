import React from "react";
import postService from "../../Services/postsService";
import { useNavigate } from "react-router-dom";

interface DeletePostButtonProps {
    postId: string;
    setUserPosts: React.Dispatch<React.SetStateAction<any>>;
}

const DeletePostButton: React.FC<DeletePostButtonProps> = ({ postId, setUserPosts }) => {
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await postService.deletePost(postId);
            setUserPosts((prevPosts: any) => prevPosts.filter((post: any) => post._id !== postId));
            alert("Post deleted successfully.");
            navigate(-1); // Redirect to the user's profile page or posts list
        } catch (err) {
            console.error("Error deleting post:", err);
            alert("Failed to delete the post.");
        }
    };

    return (
        <button
            className="btn btn-link text-danger p-0 m-0 ms-2"
            onClick={handleDelete}
        >
            <i
                className="bi bi-trash"
                style={{ fontSize: "1.5rem", cursor: "pointer" }}
            ></i>
        </button>
    );
};

export default DeletePostButton;
