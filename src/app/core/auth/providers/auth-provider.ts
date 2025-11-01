import { inject, InjectionToken, Provider } from '@angular/core';
import { environment } from '@env/environment';
import { AuthStrategy, JwtAuth, SessionAuth } from '../services';

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
