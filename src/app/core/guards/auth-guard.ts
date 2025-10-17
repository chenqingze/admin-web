import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../services/auth-store';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authStore = inject(AuthStore);
    if (authStore.isAuthenticated()) {
        return true;
    }
    authStore.setRedirectUrl(state.url);
    router.navigateByUrl('/auth/login');
    return false;
};
