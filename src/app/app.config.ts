import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withDebugTracing, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideAuthInitializer } from './core/auth/auth-initializer';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpErrorInterceptor } from './core/interceptors/http-error-interceptor';
import { authInterceptor } from './core/auth/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        provideAuthInitializer,
        {
            provide: IMAGE_LOADER,
            useValue: (config: ImageLoaderConfig) => {
                return `http://localhost:8080/files/${config.src}`;
                // return `http://localhost:8080/files/?src=${config.src}&width=${config.width}`;
            },
        },
        provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withDebugTracing()),
        provideHttpClient(withInterceptors([authInterceptor, httpErrorInterceptor])),
    ],
};
