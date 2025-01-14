import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { register} from '../Services/autoService'; // ייבוא השירות

const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const userData = { username, email, password, profilePicture };
            const response = await register(userData);
            console.log('Register successful:', response);
            alert('Register successful!');
        } catch (error: any) {
            if (error.response) {
                console.error('Register failed:', error.response.data.message);
                alert(error.response.data.message || 'Register failed');
            } else {
                console.error('Error during Register:', error.message);
                alert('An error occurred. Please try again.');
            }
        }
    };

    const handleBackToLogin = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <div className="card p-4" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Profile Picture URL</label>
                        <input
                            type="url"
                            className="form-control"
                            value={profilePicture}
                            onChange={(e) => setProfilePicture(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Register</button>
                    <button onClick={handleBackToLogin} className="btn btn-link w-100">Back to Login</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
