import {jwtDecode} from "jwt-decode";

export const isAuthenticated = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find((cookie) => cookie.startsWith('accessToken='));
    if (!tokenCookie) return false;

    const token = tokenCookie.split('=')[1];
    try {
        const decoded: any = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp > currentTime;
    } catch (error) {
        return false;
    }
}