import { AuthUser } from '@core/auth/models/auth-user';

export type TokenType = 'SESSION' | 'JWT' | 'OAUTH2';

export interface AuthState {
    tokenType: TokenType;
    token: string | null;
    currentUser: AuthUser | null;
    permissions: string[];
    expiresAt?: Date | null;
}
