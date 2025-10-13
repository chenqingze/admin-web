import {
    ApplicationConfig,
    InjectionToken,
    provideBrowserGlobalErrorListeners,
    provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withDebugTracing, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAuthInitializer } from './core/auth/auth-initializer';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './core/interceptors/http-error-interceptor';
import { authInterceptor } from './core/auth/interceptors/auth-interceptor';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { environment } from '../environments/environment';
import { AccessTokenType } from './core/auth/models/auth-state';
import { endpointInterceptor } from './core/interceptors/endpoint-interceptor';

// todo: 后期如果全局配置属性较多统一处理
export const ACCESS_TOKEN_TYPE = new InjectionToken<AccessTokenType>('access token type');
export const ENDPOINT = new InjectionToken<string>('api endpoint');
export const UPLOAD_URL = new InjectionToken<string>('upload url');
export const MEDIA_URL = new InjectionToken<string>('media url');

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
        { provide: ACCESS_TOKEN_TYPE, useValue: environment.accessTokenType },
        { provide: ENDPOINT, useValue: environment.endpoint },
        { provide: UPLOAD_URL, useValue: environment.uploadUrl },
        { provide: MEDIA_URL, useValue: environment.mediaUrl },
        provideAuthInitializer,
        provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withDebugTracing()),
        provideHttpClient(withInterceptors([endpointInterceptor, authInterceptor, httpErrorInterceptor])),
    ],
};
