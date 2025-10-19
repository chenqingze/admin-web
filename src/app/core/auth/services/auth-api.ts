import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AuthInfo } from '@core/auth/models/auth-info';
import { LoginRequest } from '@core/auth/models/login-request';

@Injectable({
    providedIn: 'root',
})
export class AuthApi {
    private readonly http = inject(HttpClient);

    /**
     * 获取认证信息(用户信息、权限等)
     */
    getAuthInfo(): Observable<AuthInfo> {
        return this.http.get<AuthInfo>('/me');
    }

    /**
     * 登录
     * @param req
     */
    login(req: LoginRequest): Observable<HttpResponse<AuthInfo>> {
        return this.http.post<AuthInfo>('/login', req, { observe: 'response' }).pipe(map((res) => res));
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
    verifySMSVerificationCode(logRequest: LoginRequest): Observable<AuthInfo> {
        return this.http.post<AuthInfo>('/verify-sms-verification-code', logRequest);
    }

    /**
     * 使用cookie的方式刷新 access_token
     */
    refreshAccessToken() {
        // todo:前后端分离项目完全可以采用 前端只持有 access token + 后端 HttpOnly cookie 存 refresh token 的模式
        return this.http.get<AuthInfo>('/access-token/refresh', { observe: 'response', withCredentials: true });
    }

    /**
     * 登出
     */
    logout(): Observable<void> {
        return this.http.post<void>('/logout', {});
    }
}
