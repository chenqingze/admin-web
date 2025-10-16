import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth-store';

export const guestGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authStore = inject(AuthStore);
    if (authStore.isLoggedIn()) {
        router.navigateByUrl('/auth/login'); // 已登录用户重定向
        return false;
    }
    return true; // 游客可以访问
};
