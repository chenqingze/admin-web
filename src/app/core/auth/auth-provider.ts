import { inject, InjectionToken, Provider } from '@angular/core';
import { environment } from '@env/environment';
import { JwtAuth } from './services/strategies/jwt-auth';
import { SessionAuth } from './services/strategies/session-auth';
import { AuthStrategy } from './services/strategies/auth-strategy';

export const AUTH_STRATEGY = new InjectionToken<AuthStrategy>('auth strategy');

export const authProvider: Provider = {
    provide: AUTH_STRATEGY,
    useFactory: () => {
        switch (environment.tokenType) {
            case 'JWT':
                return inject(JwtAuth);
            case 'SESSION':
            default:
                return inject(SessionAuth);
        }
    },
};
