import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthFacade } from '../services/auth-facade';

export const guestGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authFacade = inject(AuthFacade);
    if (authFacade.isAuthenticated()) {
        router.navigateByUrl(''); // 已登录用户重定向
        return false;
    }
    return true; // 游客可以访问
};
