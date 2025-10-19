import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, EMPTY, filter, map, Observable, switchMap, take, throwError } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthStrategy } from '@core/auth/services/strategies/auth-strategy';
import { AuthApi } from '@core/auth/services/auth-api';
import { AuthStore } from '@core/auth/services/auth-store';
import { LoginRequest } from '@core/auth/models/login-request';
import { AuthInfo } from '@core/auth/models/auth-info';

@Injectable({
    providedIn: 'root',
})
export class JwtAuth implements AuthStrategy {
    private readonly router = inject(Router);
    private readonly authApi = inject(AuthApi);
    private readonly authStore = inject(AuthStore);

    private refreshTokenInProgress = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    init(): Observable<string | null> {
        const accessToken = this.authStore.token();
        const expiresAt = this.authStore.expiresAt();
        if (accessToken && expiresAt && expiresAt > new Date().getTime()) {
            // 若 token 已过期，尝试刷新
            return this.refreshToken();
        }

        return EMPTY;
    }

    login(credentials: LoginRequest) {
        console.log(credentials);
        return EMPTY;
    }

    getAuthInfo(): Observable<AuthInfo | null> {
        throw new Error('Method not implemented.');
    }

    // todo:前后端分离项目完全可以采用 前端只持有 access token + 后端 HttpOnly cookie 存 refresh token 的模式
    refreshToken(): Observable<string | null> {
        return this.authApi.refreshAccessToken().pipe(
            map((response: HttpResponse<AuthInfo>) => {
                const token = response.headers.get('Authorization');
                if (token) {
                    const { authUser, permissions } = response.body as AuthInfo;
                    this.authStore.setToken(token);
                    this.authStore.setCurrentUser(authUser);
                    this.authStore.setPermissions(permissions);
                    return token;
                }
                this.logout();
                return null;
            }),
            catchError((err) => {
                this.logout();
                return throwError(() => err);
            }),
        );
    }

    logout(): Observable<void> {
        this.authStore.reset();
        // 避免重复 navigate 导致错误
        if (this.router.url !== '/auth/login') {
            this.router.navigate(['/auth/login']);
        }
        return EMPTY;
    }

    tokenHeaders(): Record<string, string> {
        const token = this.authStore.token();
        return token ? { Authorization: `Bearer ${this.authStore.token()}` } : {};
    }

    handle401Error(
        req: HttpRequest<unknown>,
        next: HttpHandlerFn,
        error: HttpErrorResponse,
    ): Observable<HttpEvent<unknown>> {
        // 已经在刷新中
        if (this.refreshTokenInProgress) {
            // 等待刷新完成后再重试请求
            return this.refreshTokenSubject.pipe(
                filter((token) => token != null),
                take(1),
                switchMap((token) => next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }))),
            );
        }
        // 首次刷新
        this.refreshTokenInProgress = true;
        return this.refreshToken().pipe(
            switchMap((newToken) => {
                if (newToken) {
                    this.refreshTokenSubject.next(newToken);
                    // 重试原请求
                    return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
                }
                // 刷新失败 -> 登出并跳转登录
                this.logout();
                return throwError(() => error);
            }),
            catchError((err) => {
                this.refreshTokenInProgress = false;
                // 刷新失败 -> 登出并跳转登录
                this.logout();
                return throwError(() => err);
            }),
        );
    }
}
