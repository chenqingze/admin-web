import { firstValueFrom } from 'rxjs';
import { AuthStore } from './stores/auth-store';
import { AuthApi } from './services/auth-api';
import { inject, provideAppInitializer } from '@angular/core';

export const provideAuthInitializer = provideAppInitializer(() => {
    const authStore = inject(AuthStore);
    const authApi = inject(AuthApi);
    if (authStore.accessToken()) {
        return Promise.resolve();
    }
    if (authStore.accessTokenType === 'JWT') {
        return firstValueFrom(authApi.refreshAccessToken());
    } else {
        return firstValueFrom(authApi.loadAuthUser());
    }
});
