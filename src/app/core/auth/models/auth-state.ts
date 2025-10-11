import { AuthUser } from './auth-user';
export type AccessTokenType = 'JWT' | 'SESSION';
export interface AuthState {
    accessTokenType: AccessTokenType;
    accessToken?: string | null;
    currentUser?: AuthUser | null;
}
