import { AuthUser } from '@core/auth/models/auth-user';

export interface AuthInfo {
    authUser: AuthUser;
    permissions: string[];
}
