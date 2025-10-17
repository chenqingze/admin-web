import { inject, Injectable } from '@angular/core';
import { AUTH_STRATEGY } from '../../app.config';
import { AuthStore } from './auth-store';
import { LoginRequest } from '../models/login-request';
import { EMPTY, iif, Observable } from 'rxjs';
import { AuthInfo } from '../models/auth-info';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly authStore = inject(AuthStore);
    private readonly strategy = inject(AUTH_STRATEGY);

    readonly token = this.authStore.token;
    readonly currentUser = this.authStore.currentUser;
    readonly isAuthenticated = this.authStore.isAuthenticated;
    readonly permissions = this.authStore.permissions;
    readonly expiresAt = this.authStore.expiresAt;

    hasPermission(permission: string): boolean {
        return this.authStore.hasPermission(permission);
    }

    readonly hasPermissionSignal = this.authStore.hasPermissionSignal;

    init() {
        this.strategy.init();
    }

    login(credentials: LoginRequest) {
        return this.strategy.login(credentials);
    }

    getAuthInfo(): Observable<AuthInfo | null> {
        return this.strategy.getAuthInfo();
    }

    // todo:前后端分离项目完全可以采用 前端只持有 access token + 后端 HttpOnly cookie 存 refresh token 的模式
    refreshToken(): Observable<string> {
        // 1. 检查策略是否实现了该方法 (this.activeStrategy.refreshToken 是一个函数)
        const refreshFn = this.strategy.refreshToken;

        // 2. 使用 iif (if, then, else) 来决定执行哪个 Observable
        return iif(
            // condition: 策略是否实现了 refreshToken 方法
            () => typeof refreshFn === 'function',

            // then: 执行策略的方法并返回结果
            refreshFn!(),

            // else: 返回一个立即完成且不发出任何值的 EMPTY Observable
            // 注意：因为 refreshToken 期望 string，这里需要处理类型。
            // 更好的做法是返回一个发出错误或 null 的 Observable (取决于业务需求)
            // 如果返回 EMPTY，则调用者需要知道这个 Observable 不会发出 next
            EMPTY as Observable<never>,
            // 也可以选择返回一个带有业务错误的 Observable:
            // throwError(() => new Error('Refresh not supported by current strategy'))
        ) as Observable<string>; // 强制类型转换以满足 AuthStrategy 接口要求
    }

    logout(): Observable<void> {
        return this.strategy.logout();
    }

    tokenHeaders() {
        return this.strategy.tokenHeaders();
    }

    getRedirectUrl() {
        return this.authStore.getRedirectUrl();
    }

    setRedirectUrl(redirectUrl: string | null) {
        this.authStore.setRedirectUrl(redirectUrl);
    }
}
