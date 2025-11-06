import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthFacade } from '../services';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authFacade = inject(AuthFacade);

    // 未认证
    if (!authFacade.isAuthenticated()) {
        // console.log('未认证');
        authFacade.setRedirectUrl(state.url);
        router.navigateByUrl('/auth/login');
        return false;
    }

    // 未授权
    const requiredPermission = route.data['perm'];
    if (!authFacade.hasPermission(requiredPermission)) {
        // console.log('未授权');
        router.navigateByUrl('');
        return false;
    }

    return true;
};
