import {
    ApplicationConfig,
    inject,
    InjectionToken,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAuthInitializer } from './core/init/auth-initializer';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './core/interceptors/http-error-interceptor';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from '../environments/environment';
import { endpointInterceptor } from './core/interceptors/endpoint-interceptor';
import { TokenType } from './core/models/auth-state';
import { AuthStrategy } from './core/services/strategies/auth-strategy';
import { SessionAuth } from './core/services/strategies/session-auth';
import { JwtAuth } from './core/services/strategies/jwt-auth';

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
        provideHttpClient(withInterceptors([endpointInterceptor, authInterceptor, httpErrorInterceptor])),
    ],
};
