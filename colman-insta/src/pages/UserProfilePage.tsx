import React from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from '../components/users/UserProfile.tsx';
import { useQuery } from '@tanstack/react-query';
import userService from '../Services/usersService.ts';
import UserPosts from '../components/posts/UserPosts.tsx';

const UserProfilePage: React.FC = () => {
    const { username } = useParams();

    const { data: user, isLoading, isError, error } = useQuery({
        queryKey: ['user', username],
        queryFn: () => userService.getUserByName(username!),
        enabled: !!username,
    });
    if (!username) {
        return <div className="text-center">No username found.</div>;
    }
    if (isLoading) {
        return <div className="text-center mt-5">Loading user data...</div>;
    }
    if (isError || !user) {
        return (
            <div className="alert alert-danger text-center mt-5" role="alert">
                Error fetching user data: {(error as Error)?.message || 'Unknown error'}
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <UserProfile username={username} />
            <div className="container mt-4">
                <h4>Posts by {username}</h4>
                <UserPosts userId={user._id!} />
            </div>
        </div>
    );
};

export default UserProfilePage;
