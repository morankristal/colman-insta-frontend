import React from 'react';
import LoginForm from '../components/users/LoginForm.tsx';
import {isAuthenticated} from "../utils/isAuthenticated.ts";
import {Navigate} from "react-router-dom";


function LoginPage() {
    const [authenticated, setAuthenticated] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const fetchAuthenticated = async () => {
        const auth = await isAuthenticated();
        setAuthenticated(auth);
        setLoading(false)
    }

    React.useEffect(() => {
        fetchAuthenticated();
    }, [])


    if (loading) return <p>Loading...</p>


    return (
        authenticated ? <Navigate to="/homePage" /> : <LoginForm />
    );
}

export default LoginPage;
