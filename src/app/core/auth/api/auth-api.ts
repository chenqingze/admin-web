import { inject, Injectable } from '@angular/core';
import { LoginRequest } from '../models/login-request';
import { AuthUser } from '../models/auth-user';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthApi {
    private http = inject(HttpClient);

    /**
     * 获取认证用户信息
     */
    getAuthUser(): Observable<AuthUser> {
        return this.http.get<AuthUser>('/api/me');
    }

    /**
     * 登录
     * @param req
     */
    login(req: LoginRequest): Observable<HttpResponse<AuthUser>> {
        return this.http.post<AuthUser>('/login', req, { observe: 'response' }).pipe(map((res) => res));
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
    refreshAccessToken() {
        // todo:前后端分离项目完全可以采用 前端只持有 access token + 后端 HttpOnly cookie 存 refresh token 的模式
        return this.http.get<AuthUser>('/access-token/refresh', { observe: 'response', withCredentials: true });
    }

    /**
     * 登出
     */
    logout(): Observable<void> {
        return this.http.post<void>('/logout', {});
    }
}
