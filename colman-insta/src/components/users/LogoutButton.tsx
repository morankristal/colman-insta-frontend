import React from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import authService from "../../Services/authService";

const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const refreshToken = Cookies.get("refreshToken");
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
            Cookies.remove("accessToken");
            Cookies.remove("refreshToken");
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <button className="btn btn-danger" onClick={handleLogout}>
            Logout
        </button>
    );
};

export default LogoutButton;
