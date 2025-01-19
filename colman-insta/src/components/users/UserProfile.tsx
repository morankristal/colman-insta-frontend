import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import userService from '../../Services/usersService.ts';

interface UserProfileProps {
    username: string;
}

interface DecodedToken {
    _id: string;
    exp: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ username }) => {
    const navigate = useNavigate();

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

    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ['user', username],
        queryFn: () => userService.getUserByName(username),
        enabled: !!username,
    });

    if (isLoading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="alert alert-danger text-center mt-5" role="alert">
                Error fetching user data: {(error as Error).message}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="alert alert-warning text-center mt-5" role="alert">
                No user found.
            </div>
        );
    }

    const isCurrentUser = currentUser && currentUser._id === user._id;

    const handleEditProfile = () => {
        navigate(`/edit-profile/${user._id}`);
    };

    const handleBackHomePageClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate("/homePage");
    };

    return (
        <div>
            <button
                className="btn btn-primary position-absolute top-0 start-0 m-3"
                onClick={handleBackHomePageClick}
            >
                Back to Home Page
            </button>

            <div className="container mt-5">
                <div className="card mx-auto shadow" style={{ maxWidth: '600px' }}>
                    <div className="card-body">
                        <div className="d-flex align-items-center">
                            <img
                                src={user.profilePicture}
                                alt="Profile"
                                className="rounded-circle me-3"
                                style={{ width: '100px', height: '100px' }}
                            />
                            <div>
                                <h2 className="card-title mb-1">{user.username}</h2>
                                <p className="card-text mb-0">
                                    <strong>Email:</strong> {user.email}
                                </p>
                            </div>
                        </div>
                        {isCurrentUser && (
                            <div className="text-center mt-4">
                                <button className="btn btn-primary" onClick={handleEditProfile}>
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
