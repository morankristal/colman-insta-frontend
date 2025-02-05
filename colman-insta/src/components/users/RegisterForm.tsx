import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { register } from '../../Services/authService.ts';

const RegisterForm: React.FC = () => {
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: '',
        profilePicture: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "password") {
            validatePassword(value);
        }
        setUserDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const validatePassword = (password: string) => {
        const minLength = 6;
        const hasNumber = /\d/.test(password);
        const hasLetter = /[a-zA-Z]/.test(password);
        if (password.length < minLength) {
            setPasswordError("Password must be at least 6 characters long.");
        } else if (!hasNumber || !hasLetter) {
            setPasswordError("Password must contain at least one letter and one number.");
        } else {
            setPasswordError('');
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordError) return;
        try {
            const response = await register(userDetails); // שימוש בשירות
            console.log('Register successful:', response);
            navigate("/login");
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
        navigate("/login");
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
                            name="username"
                            className="form-control"
                            value={userDetails.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={userDetails.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            value={userDetails.password}
                            onChange={handleInputChange}
                            required
                        />
                        {passwordError && <small className="text-danger">{passwordError}</small>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Profile Picture URL</label>
                        <input
                            type="url"
                            name="profilePicture"
                            className="form-control"
                            value={userDetails.profilePicture}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3" disabled={!!passwordError}>Register</button>
                    <button onClick={handleBackToLogin} className="btn btn-link w-100">Back to Login</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
