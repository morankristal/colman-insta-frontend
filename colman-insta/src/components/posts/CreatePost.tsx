import React, { useState } from "react";
import { createPost } from "../../Services/postsService.ts";
import { useNavigate } from "react-router-dom";

const CreatePost: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setImage(e.target.files[0]);
    };

    const handleBackHomePageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate("/homePage");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title && content && image) {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("image", image);

            try {
                const newPost = await createPost(formData);
                console.log("Post created: ", newPost);
                navigate(-1);
            } catch (err) {
                console.error("Error creating post: ", err);
            }
        } else {
            console.error("All fields are required.");
        }
    };

    return (
        <div className="container mt-5">
            <button
                className="btn btn-outline-secondary position-absolute top-0 start-0 m-3"
                onClick={handleBackHomePageClick}
            >
                <i className="bi bi-arrow-left-circle"></i> Back to Home Page
            </button>
            <div className="d-flex justify-content-center align-items-center">
                <div className="card p-4" style={{ width: "500px" }}>
                    <h1 className="text-center mb-4">Create New Post</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                id="title"
                                className="form-control"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="content" className="form-label">Content</label>
                            <textarea
                                id="content"
                                className="form-control"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Image</label>
                            <input
                                type="file"
                                id="image"
                                className="form-control"
                                onChange={handleFileChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary w-100">Create Post</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
