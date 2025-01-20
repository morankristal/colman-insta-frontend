import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import postService from "../../Services/postsService.ts";
import 'bootstrap-icons/font/bootstrap-icons.css';


const EditPost: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        content: "",
        image: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const post = await postService.getPostById(id || "");
                if (post) {
                    setFormData({
                        title: post.title,
                        content: post.content,
                        image: post.image || "",
                    });
                }
                setIsLoading(false);
            } catch (err) {
                setError("Failed to load post data.");
                setIsLoading(false);
            }
        };
        if (id) {
            fetchPostData();
        }
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setImageFile(file); // נשמור את הקובץ החדש שנבחר
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedPost = { _id: id, ...formData };
            const formDataToSend = new FormData();
            formDataToSend.append("title", updatedPost.title);
            formDataToSend.append("content", updatedPost.content);
            if (imageFile) {
                formDataToSend.append("image", imageFile);
            } else {
                formDataToSend.append("image", formData.image);
            }

            await postService.updatePost(id!, formDataToSend);

            navigate(-1);
        } catch (err) {
            setError("Failed to update post.");
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-5">
            <h2>Edit Post</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                        Title
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="content" className="form-label">
                        Content
                    </label>
                    <textarea
                        className="form-control"
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={5}
                        required
                    ></textarea>
                </div>
                <div className="mb-3">
                    <label htmlFor="image" className="form-label">
                        Image
                    </label>
                    <input
                        type="file"
                        className="form-control"
                        id="image"
                        name="image"
                        onChange={handleFileChange}
                    />
                    {formData.image && !imageFile && (
                        <p>Current Image: {formData.image}</p>
                    )}
                </div>
                <button type="submit" className="btn btn-primary">
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditPost;
