import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import { AuthUser } from '../models/auth-user';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthStore } from '../stores/auth-store';

@Injectable({
    providedIn: 'root',
})
export class AuthApi {
    private http = inject(HttpClient);
    private authStore = inject(AuthStore);

    /**
     * 获取认证用户信息
     */
    loadAuthUser() {
        if (this.authStore.accessToken()) {
            return this.http.get<AuthUser>('/api/me').pipe(
                tap((user) => this.authStore.setCurrentUser(user)),
                catchError(() => {
                    this.authStore.reset();
                    return of(null);
                }),
            );
        }
        return of(null);
    }

    /**
     * 登录
     * @param req
     */
    login(req: LoginRequest): Observable<AuthUser> {
        return this.http.post<AuthUser>('/login', req).pipe(map((res) => res));
    }

    /**
     * 登出
     */
    logout(): Observable<void> {
        return this.http.post<void>('/logout', {});
    }

    /**
     * 请求验证码
     * @param phoneNumber
     */
    sendSMSVerificationCode(phoneNumber: string): Observable<unknown> {
        return this.http.post('/send-sms-verification-code', { phoneNumber: phoneNumber });
    }

    /**
     * 验证短信码
     * @param logRequest
     */
    verifySMSVerificationCode(logRequest: LoginRequest): Observable<unknown> {
        return this.http.post('/verify-sms-verification-code', logRequest);
    }

    /**
     * 使用cookie的方式刷新 access_token
     */
    refreshAccessToken(): Observable<string | null> {
        // todo:前后端分离项目完全可以采用 前端只持有 access token + 后端 HttpOnly cookie 存 refresh token 的模式
        return this.http.get<AuthUser>('/access-token/refresh', { observe: 'response', withCredentials: true }).pipe(
            map((response: HttpResponse<AuthUser>) => {
                const xAuthToken = response.headers.get('X-Auth-Token');
                this.authStore.setAccessToken(xAuthToken);
                this.authStore.setCurrentUser(response.body);
                return xAuthToken;
            }),
            catchError(() => {
                this.logout();
                return of(null);
            }),
        );
    }
}
