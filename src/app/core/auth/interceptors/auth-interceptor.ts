import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../stores/auth-store';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { AuthApi } from '../services/auth-api';

/**
 * 认证相关 (token, 401)
 * @param req
 * @param next
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    let refreshTokenInProgress = false;
    const refreshTokenSubject = new BehaviorSubject<string | null>(null);
    const authStore = inject(AuthStore);
    const authApi = inject(AuthApi);
    const token = authStore.accessToken();

    const headers: Record<string, string> = {};
    if (token) {
        if (authStore.accessTokenType === 'JWT') {
            headers['Authorization'] = `Bearer ${token}`;
        } else if (authStore.accessTokenType === 'SESSION') {
            headers['X-AUTH-TOKEN'] = token;
        }
    }

    return next(req.clone({ setHeaders: headers })).pipe(
        catchError((err: HttpErrorResponse) => {
            // 如果是返回 401(Unauthorized)
            if (err.status === 401) {
                // 如果是JWT并且token存在，尝试刷新 token,否则直接跳转到login页面
                if (token && authStore.accessTokenType === 'JWT') {
                    if (refreshTokenInProgress) {
                        // 如果正在刷新access_token,则等待刷新完成后再重试
                        return refreshTokenSubject.pipe(
                            filter((t) => t != null),
                            take(1),
                            switchMap((newToken) => {
                                const retryReq = req.clone({
                                    setHeaders: { Authorization: newToken! },
                                });
                                return next(retryReq);
                            }),
                        );
                    } else {
                        // 否则直接请求刷新access_token
                        return authApi.refreshAccessToken().pipe(
                            switchMap((newToken) => {
                                refreshTokenInProgress = false;
                                if (!newToken) {
                                    // 刷新失败 -> 重置(触发跳转登录页)
                                    authStore.reset();
                                    return throwError(() => err);
                                }
                                refreshTokenSubject.next(newToken);
                                // 重试原请求
                                const retryReq = req.clone({
                                    setHeaders: { Authorization: `Bearer ${newToken}` },
                                });
                                return next(retryReq);
                            }),
                        );
                    }
                } else {
                    // 直接重置(触发跳转登录页)
                    authStore.reset();
                }
            }
            return throwError(() => err);
        }),
    );
};
