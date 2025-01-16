import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie';
import userService from '../Services/usersService'; // שירות לפעולות על משתמשים
import SearchBar from '../components/SearchBar';

interface DecodedToken {
    _id: string;
    exp: number;
    iat: number;
}

const HomePage: React.FC = () => {
    const [loggedInUser, setLoggedInUser] = useState<{ username: string; profilePicture: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLoggedInUser = async () => {
            try {
                const token = Cookies.get('accessToken');
                if (token) {
                    const decoded: DecodedToken = jwtDecode(token); // פענוח הטוקן
                    const userId = decoded._id;
                    const user = await userService.getUserById(userId);
                    setLoggedInUser({ username: user.username, profilePicture: user.profilePicture });
                }
            } catch (error) {
                console.error('Error fetching logged-in user:', error);
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
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid d-flex justify-content-between align-items-center">
                    <SearchBar onSearch={(username) => console.log(`Searching for user: ${username}`)} />
                    {loggedInUser && (
                        <button
                            className="btn btn-light rounded-circle p-0"
                            style={{
                                width: '50px',
                                height: '50px',
                                overflow: 'hidden',
                            }}
                            onClick={handleGoToProfile}
                        >
                            <img
                                src={loggedInUser.profilePicture}
                                alt="Profile"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                }}
                            />
                        </button>
                    )}
                </div>
            </nav>

            <div className="container mt-4">
                <h2>ברוך הבא לאפליקציית המשתמשים!</h2>
                <p>השתמש בשורת החיפוש למעלה כדי לחפש משתמשים ולהציג את פרטי המשתמש.</p>
            </div>
        </div>
    );
};

export default HomePage;
