import React from 'react';
import LoginForm from '../components/users/LoginForm.tsx';
import {isAuthenticated} from "../utils/isAuthenticated.ts";
import {Navigate} from "react-router-dom";

const LoginPage: React.FC = () =>
    isAuthenticated() ? <Navigate to="/homePage" /> : <LoginForm />;


export default LoginPage;
