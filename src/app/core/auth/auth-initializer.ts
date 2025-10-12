import { firstValueFrom } from 'rxjs';
import { AuthStore } from './stores/auth-store';
import { inject, provideAppInitializer } from '@angular/core';

export const provideAuthInitializer = provideAppInitializer(() => {
    const authStore = inject(AuthStore);

    if (!authStore.accessToken()) {
        return Promise.resolve();
    }

    if (authStore.accessTokenType === 'SESSION') {
        return firstValueFrom(authStore.loadCurrentUser());
    } else if (authStore.accessTokenType === 'JWT') {
        return firstValueFrom(authStore.refreshAccessToken());
    }

    return Promise.resolve();
});
