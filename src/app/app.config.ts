import {
    ApplicationConfig,
    inject,
    InjectionToken,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { AuthStrategy } from '@core/auth/services/strategies/auth-strategy';
import { JwtAuth } from '@core/auth/services/strategies/jwt-auth';
import { SessionAuth } from '@core/auth/services/strategies/session-auth';
import { provideAuthInitializer } from '@core/auth/auth-initializer';
import { endpointInterceptor } from '@core/api/endpoint-interceptor';
import { authInterceptor } from '@core/auth/interceptors/auth-interceptor';
import { errorInterceptor } from '@core/api/error-interceptor';
import { TokenType } from '@core/auth/models/auth-state';
import { environment } from '@env/environment';

// todo: 后期如果全局配置属性较多统一处理
export const ENDPOINT = new InjectionToken<string>('api endpoint');
export const UPLOAD_URL = new InjectionToken<string>('upload url');
export const MEDIA_URL = new InjectionToken<string>('media url');
export const TOKEN_TYPE = new InjectionToken<TokenType>('token type');
export const AUTH_STRATEGY = new InjectionToken<AuthStrategy>('auth strategy');

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'outline',
            },
        },
        {
            provide: IMAGE_LOADER,
            useValue: (config: ImageLoaderConfig) => {
                return `${environment.mediaUrl}?src=${config.src}&width=${config.width}`;
            },
        },
        { provide: ENDPOINT, useValue: environment.endpoint },
        { provide: UPLOAD_URL, useValue: environment.uploadUrl },
        { provide: MEDIA_URL, useValue: environment.mediaUrl },
        { provide: TOKEN_TYPE, useValue: environment.tokenType },
        {
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
        },
        provideAuthInitializer,
        provideRouter(routes, withComponentInputBinding(), withViewTransitions() /*, withDebugTracing()*/),
        provideHttpClient(withInterceptors([endpointInterceptor, authInterceptor, errorInterceptor])),
    ],
};
