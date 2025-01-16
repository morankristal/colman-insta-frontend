export interface UserData {
    _id?: string;
    username: string;
    email: string;
    password?: string;
    profilePicture: string;
    refreshToken?: string[];
}


export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
    _id?: string;
}