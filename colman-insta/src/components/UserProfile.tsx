import React from 'react';
import { useQuery } from '@tanstack/react-query';
import userService from '../Services/usersService';

interface UserProfileProps {
    username: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ username }) => {
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

    return (
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
                    <div className="text-center mt-4">
                        <button className="btn btn-primary">Edit Profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
