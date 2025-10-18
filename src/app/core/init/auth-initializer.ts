import { inject, provideAppInitializer } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const provideAuthInitializer = provideAppInitializer(() => {
    const authService = inject(AuthService);
    return authService.init();
});
