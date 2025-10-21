import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthFacade } from '../services/auth-facade';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authFacade = inject(AuthFacade);
    if (authFacade.isAuthenticated()) {
        return true;
    }
    authFacade.setRedirectUrl(state.url);
    router.navigateByUrl('/auth/login');
    return false;
};
