import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {isAuthenticated} from "../utils/isAuthenticated.ts";

const ProtectedRoute: React.FC = () => isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;


export default ProtectedRoute;
