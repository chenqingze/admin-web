import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../stores/auth-store';

export const authGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authStore = inject(AuthStore);
    if (authStore.isLoggedIn()) {
        return true;
    }

    router.navigate(['/login'], { skipLocationChange: true });
    return false;
};
