import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import {login} from "../../Services/authService.ts";

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegisterClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate("/register");
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login( username, password );
            console.log('Login successful:', response);
            alert('Login successful!');
            console.log("hi" ,document.cookie);
            navigate("/homePage");
        } catch (error: any) {
            if (error.response) {
                console.error('Login failed:', error.response.data.message);
                alert(error.response.data.message || 'Login failed');
            } else {
                console.error('Error during login:', error.message);
                alert('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            <div className="card p-4" style={{ width: '400px' }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
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
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit"  className="btn btn-primary w-100 mb-3">Login</button>
                    <button onClick={handleRegisterClick} className="btn btn-link w-100">If you are not registered, register here</button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
