import { inject, provideAppInitializer } from '@angular/core';
import { AuthFacade } from './services/auth-facade';

export const provideAuthInitializer = provideAppInitializer(() => {
    const authFacade = inject(AuthFacade);
    return authFacade.init();
});
