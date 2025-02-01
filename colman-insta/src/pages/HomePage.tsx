import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import userService from "../Services/usersService";
import SearchBar from "../components/SearchBar";
import PostsLoader from "../components/posts/PostsLoader.tsx";
import LogoutButton from "../components/users/LogoutButton";
import "bootstrap-icons/font/bootstrap-icons.css";

interface DecodedToken {
    _id: string;
    exp: number;
    iat: number;
}

const HomePage: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<{
        username: string;
        profilePicture: string;
    } | null>(null);

    const [searchResults, setSearchResults] = useState<string[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const token = Cookies.get("accessToken");
                if (token) {
                    const decoded: DecodedToken = jwtDecode(token);
                    const userId = decoded._id;
                    const user = await userService.getUserById(userId);
                    setLoggedInUser({
                        username: user.username,
                        profilePicture: user.profilePicture,
                    });
                }
            } catch (error) {
                console.error("Error fetching logged-in user:", error);
            }
        };

        fetchLoggedInUser();
    }, []);

    const handleGoToProfile = () => {
        if (loggedInUser) {
            navigate(`/profile/${loggedInUser.username}`);
        }
    };

    const handleSearch = async (username: string) => {
        try {
            const results = await userService.searchUsers(username);
            setSearchResults(results);
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div className="bg-light min-vh-100">
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between w-100 align-items-center">
                        <SearchBar
                            onSearch={handleSearch}
                            searchResults={searchResults}
                        />
                        <div className="d-flex align-items-center">
                            {loggedInUser && (
                                <>
                                    <button
                                        className="btn btn-light rounded-circle p-0 me-3 shadow-sm"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            overflow: "hidden",
                                        }}
                                        onClick={handleGoToProfile}
                                    >
                                        <img
                                            src={loggedInUser.profilePicture}
                                            alt="Profile"
                                            style={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "50%",
                                            }}
                                        />
                                    </button>
                                    <LogoutButton />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <div className="container mt-5">
                <PostsLoader />
            </div>
            <Link to="/create-post">
                <button
                    className="btn btn-primary rounded-circle position-fixed shadow"
                    style={{
                        width: "50px",
                        height: "50px",
                        bottom: "16px",
                        right: "16px",
                    }}
                >
                    <i className="bi bi-plus-lg fs-4 text-white"></i>
                </button>
            </Link>
            <Link to="/ai-create-post">
                <button
                    className="btn btn-success rounded-circle position-fixed shadow"
                    style={{
                        width: "50px",
                        height: "50px",
                        bottom: "80px",
                        right: "16px",
                    }}
                >
                    <i className="bi bi-robot fs-4 text-white"></i>
                </button>
            </Link>
        </div>
    );
};

export default HomePage;
