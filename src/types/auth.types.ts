export interface ILoginResponse {
    token: string;
    accessToken: string;
    refreshToken: string;
    user: {
        needPasswordChange: boolean;
        email: string;
        name: string;
        role: string;
        image: string;
        status: string;
        isDeleted: boolean;
        emailVerified: boolean;
    }
}

export interface IAuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
    status?: string;
    isDeleted?: boolean;
    emailVerified: boolean;
    needPasswordChange?: boolean;
}

export type IUserProfile = IAuthUser;

export type IUpdateProfileResponse = IAuthUser;