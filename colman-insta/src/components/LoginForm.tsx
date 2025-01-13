import React, { useState } from 'react';
import axios from 'axios';

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login/', {
                username,
                password,
            });
            console.log('Login successful:', response.data);
            alert('Login successful!');
        } catch (error: any) {
            if (error.response) {
                // שגיאה מהשרת
                console.error('Login failed:', error.response.data.message);
                alert(error.response.data.message || 'Login failed');
            } else {
                // שגיאה אחרת (למשל, אין חיבור לשרת)
                console.error('Error during login:', error.message);
                alert('An error occurred. Please try again.');
            }
        }
    };

            return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <label>
                username:
                <input
                    type="string"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </label>
            <label>
                Password:
                <input
                    type="string"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
