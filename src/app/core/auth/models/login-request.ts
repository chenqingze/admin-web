export interface LoginRequest {
    username: string;
    password: string;
    otp?: string;
    rememberMe: boolean;
}
