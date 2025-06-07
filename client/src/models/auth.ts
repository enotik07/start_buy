export interface IAuthResponse {
    access_token: string;
    refresh_token: string;
    is_admin: boolean;
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IRegisterRequest {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    dob: string;
    is_admin: boolean;
}

export interface IRefreshRequest {
    refresh_token: string;
}