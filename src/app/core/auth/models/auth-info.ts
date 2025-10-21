import { AuthUser } from './auth-user';

export interface AuthInfo {
    authUser: AuthUser;
    permissions: string[];
}
