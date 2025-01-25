import {jwtDecode} from "jwt-decode";
import authService from "../Services/authService.ts";

export const isAuthenticated = async  () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('accessToken='));
    if (!tokenCookie) {
        const refreshTokenCookie = cookies.find((cookie) => cookie.startsWith('refreshToken='));
        if(!refreshTokenCookie) return false;

        const refreshToken = refreshTokenCookie.split('=')[1];
         await authService.refresh(refreshToken!)
        return true
    }

    const token = tokenCookie.split('=')[1];
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime;
    } catch (error) {
        return false;
    }
}
