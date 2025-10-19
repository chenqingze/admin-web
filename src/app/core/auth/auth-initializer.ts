import { inject, provideAppInitializer } from '@angular/core';
import { AuthFacade } from '@core/auth/services/auth-facade';

export const provideAuthInitializer = provideAppInitializer(() => {
    const authFacade = inject(AuthFacade);
    return authFacade.init();
});
