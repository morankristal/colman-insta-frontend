import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import userService from "../Services/usersService"; // שירות לפעולות על משתמשים
import SearchBar from "../components/SearchBar";
import PostsLoader from "../components/PostsLoader"; // הייבוא של קומפוננטת טעינת הפוסטים

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
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const token = Cookies.get("accessToken");
                if (token) {
                    const decoded: DecodedToken = jwtDecode(token); // פענוח הטוקן
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
            navigate(`/user/${loggedInUser.username}`);
        }
    };

    return (
        <div>
            {/* ניווט */}
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                    <div className="d-flex justify-content-between w-100">
                        {/* שורת חיפוש */}
                        <SearchBar
                            onSearch={(username) => console.log(`Searching for user: ${username}`)}
                        />

                        {/* כפתור פרופיל משתמש */}
                        {loggedInUser && (
                            <button
                                className="btn btn-light rounded-circle p-0"
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
                        )}
                    </div>
                </div>
            </nav>

            {/* תוכן עמוד הבית */}
            <div className="container mt-4">
                <h2>ברוך הבא לאפליקציית המשתמשים!</h2>
                <p>השתמש בשורת החיפוש למעלה כדי לחפש משתמשים ולהציג את פרטי המשתמש.</p>
            </div>

            {/* הצגת הפוסטים */}
            <div className="container mt-4">
                <PostsLoader /> {/* הצגת קומפוננטת טעינת הפוסטים */}
            </div>

            {/* כפתור פלוס להוספת פוסט */}
            <Link to="/create-post">
                <button
                    className="btn btn-success position-fixed bottom-0 end-0 m-3 rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                        width: "60px",
                        height: "60px",
                        fontSize: "30px",
                    }}
                >
                    <span className="text-white">+</span>
                </button>
            </Link>
        </div>
    );
};

export default HomePage;
