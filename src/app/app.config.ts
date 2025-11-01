import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { uiProviders } from '@ui';
import { baseUrlInterceptor, errorInterceptor, httpProviders } from '@api';
import { authInterceptor, authProvider } from '@auth';
import { provideAuthInitializer } from '@core/init';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZonelessChangeDetection(),
        ...uiProviders,
        ...httpProviders,
        authProvider,
        provideAuthInitializer,
        provideRouter(
            routes,
            withComponentInputBinding(),
            withViewTransitions(),
            /*withNavigationErrorHandler((error) => {
                const router = inject(Router);
                if (error?.message) {
                    console.error('Navigation error occurred:', error.message);
                }
                router.navigate(['/error']);
            }),*/
            /*, withDebugTracing()*/
        ),
        provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor, errorInterceptor])),
    ],
};
