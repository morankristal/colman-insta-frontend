import React from 'react';
import { useParams } from 'react-router-dom';
import UserProfile from '../components/UserProfile';

const UserProfilePage: React.FC = () => {
    const { username } = useParams();

    if (!username) {
        return <div className="text-center">No username found.</div>;
    }

    return (
        <div className="container mt-5">
            <UserProfile username={username} />
            {/* User Posts Section (Placeholder for future posts) */}
            <div className="container mt-4">
                <h4>Posts by {username}</h4>
                <p><i>No posts available yet.</i></p>
            </div>
        </div>
    );
};

export default UserProfilePage;
