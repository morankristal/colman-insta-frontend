import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import postService from "../../Services/postsService";

const DeletePostButton: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const handleDelete = async () => {
        if (!id) {
            console.error("Post ID is missing");
            return;
        }

        try {
            await postService.deletePost(id);
            alert("Post deleted successfully.");
            navigate(-1);
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
