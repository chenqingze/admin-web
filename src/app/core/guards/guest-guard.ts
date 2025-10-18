import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const guestGuard: CanActivateFn = () => {
    const router = inject(Router);
    const authService = inject(AuthService);
    if (authService.isAuthenticated()) {
        router.navigateByUrl(''); // 已登录用户重定向
        return false;
    }
    return true; // 游客可以访问
};
