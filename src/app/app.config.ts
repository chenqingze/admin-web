import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAuthInitializer } from '@core/auth/auth-initializer';
import { baseUrlInterceptor } from '@core/api/interceptors/base-url-interceptor';
import { authInterceptor } from '@core/auth/interceptors/auth-interceptor';
import { errorInterceptor } from '@core/api/interceptors/error-interceptor';
import { authProvider } from '@core/auth/auth-provider';
import { uiProviders } from '@core/ui/ui-providers';
import { httpProviders } from '@core/api/http-providers';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        uiProviders,
        httpProviders,
        authProvider,
        provideAuthInitializer,
        provideRouter(routes, withComponentInputBinding(), withViewTransitions() /*, withDebugTracing()*/),
        provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor, errorInterceptor])),
    ],
};
