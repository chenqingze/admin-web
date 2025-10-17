import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { TOKEN_TYPE } from '../../app.config';

/**
 * 认证相关 (token, 401)
 * @param req
 * @param next
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const tokenType = inject(TOKEN_TYPE);
    const token = authService.token();
    const headers = authService.tokenHeaders();

    let refreshTokenInProgress = false;
    const refreshTokenSubject = new BehaviorSubject<string | null>(null);
    function handle401Error(
        req: HttpRequest<unknown>,
        next: HttpHandlerFn,
        originalError: HttpErrorResponse,
        authService: AuthService,
    ) {
        if (refreshTokenInProgress) {
            // 等待刷新完成后再重试请求
            return refreshTokenSubject.pipe(
                filter((token) => token != null),
                take(1),
                switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
            );
        }
        // 刷新access_token
        refreshTokenInProgress = true;
        return authService.refreshToken().pipe(
            switchMap((newToken) => {
                if (!newToken) {
                    // 刷新失败 -> 直接登出
                    authService.logout();
                    return throwError(() => originalError);
                }

                refreshTokenSubject.next(newToken);
                // 重试原请求
                return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
            }),
            catchError((err) => {
                refreshTokenInProgress = false;
                // 刷新失败 -> 直接登出
                authService.logout();
                return throwError(() => err);
            }),
        );
    }

    return next(req.clone({ setHeaders: headers })).pipe(
        catchError((err: HttpErrorResponse) => {
            // 仅处理 JWT 的 401 情况
            if (err.status === 401 && token && tokenType === 'JWT') {
                handle401Error(req, next, err, authService);
            }
            // SESSION认证方式返回401 或其他错误：登出 + 抛出错误
            authService.logout();
            return throwError(() => err);
        }),
    );
};
