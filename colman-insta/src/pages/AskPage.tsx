import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import askService from '../Services/askService';

const AskPage: React.FC = () => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBackHomePageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate("/homePage");
    };

    const handleGeneratePost = async () => {
        setLoading(true);
        try {
            const aiResponse = await askService.askAI(prompt);

            navigate("/create-post", {
                state: {
                    aiResponse,
                },
            });
        } catch (error) {
            console.error("Error generating post:", error);
        } finally {
            setLoading(false);
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
            <h1 className="mb-4">Create a Post with AI</h1>
            <textarea
                className="form-control mb-3"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your post idea..."
            ></textarea>
            <button
                className="btn btn-primary"
                onClick={handleGeneratePost}
                disabled={loading || !prompt.trim()}
            >
                {loading ? "Generating..." : "Generate Post"}
            </button>
        </div>
    );
};

export default AskPage;
