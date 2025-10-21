import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthFacade } from '../services/auth-facade';

/**
 * 认证相关 (token, 401)
 * @param req
 * @param next
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authFacade = inject(AuthFacade);
    const headers = authFacade.tokenHeaders();

    return next(req.clone({ setHeaders: headers })).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
                // 仅处理 401 的情况
                return authFacade.handle401Error(req, next, err);
            }
            // 其他错误直接抛出
            return throwError(() => err);
        }),
    );
};
