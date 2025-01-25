import React, {useEffect} from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {isAuthenticated} from "../utils/isAuthenticated.ts";

export function ProtectedRoute() {
    const [authenticated, setIsAuthenticated] = React.useState(false);
    const [loading, setLoading] = React.useState(true);

    const fetchIsAuthenticated = async () => {
            setLoading(true);
            const response = await isAuthenticated();
            setIsAuthenticated(response);
            setLoading(false);
    }

    useEffect(() => {
        fetchIsAuthenticated()
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return authenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
