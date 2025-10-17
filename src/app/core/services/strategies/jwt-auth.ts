import { inject, Injectable } from '@angular/core';
import { AuthStrategy } from './auth-strategy';
import { catchError, EMPTY, map, Observable, throwError } from 'rxjs';
import { AuthInfo } from '../../models/auth-info';
import { LoginRequest } from '../../models/login-request';
import { HttpResponse } from '@angular/common/http';
import { AuthApi } from '../auth-api';
import { AuthStore } from '../auth-store';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class JwtAuth implements AuthStrategy {
    private readonly router = inject(Router);
    private readonly authApi = inject(AuthApi);
    private readonly authStore = inject(AuthStore);

    init() {
        const accessToken = this.authStore.token();
        if (!accessToken) return;
        // 若 token 已过期，尝试刷新
        const expiresAt = this.authStore.expiresAt();
        if (expiresAt && expiresAt > new Date().getTime()) {
            this.refreshToken();
        }
    }

    login(credentials: LoginRequest) {
        console.log(credentials);
        throw new Error('Method not implemented.');
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
}
