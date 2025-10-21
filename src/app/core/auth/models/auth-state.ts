import { AuthUser } from './auth-user';
import { TokenType } from './token-type';

export interface AuthState {
    tokenType: TokenType;
    token: string | null;
    currentUser: AuthUser | null;
    permissions: string[];
    expiresAt?: Date | null;
}
