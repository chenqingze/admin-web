import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

/**
 * 认证相关 (token, 401)
 * @param req
 * @param next
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const headers = authService.tokenHeaders();

    return next(req.clone({ setHeaders: headers })).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
                // 仅处理 401 的情况
                return authService.handle401Error(req, next, err);
            }
            // 其他错误直接抛出
            return throwError(() => err);
        }),
    );
};
