import { Observable } from 'rxjs';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { AuthInfo, LoginRequest } from '../../models';

export interface AuthStrategy {
    /**
     * 初始化方法
     */
    init(): Observable<unknown>;

    /**
     * 登录方法
     * @param credentials - 凭证（例如：用户名/密码，或 OAuth2 token/code）
     * @returns 登录结果的 Observable
     */
    login(credentials: LoginRequest): Observable<unknown>;

    /**
     * 初始化认证状态/获取当前认证信息（例如：获取用户信息和权限 等）
     */
    getAuthInfo(): Observable<AuthInfo | null>;

    /**
     * 刷新访问令牌的方法 (Refresh Token)
     * 通常使用一个长效的 Refresh Token 来获取新的 Access Token
     * @returns 新的访问令牌的 Observable
     */
    refreshToken?(): Observable<string | null>;

    /**
     * 登出方法
     * @returns 登出结果的 Observable
     */
    logout(): Observable<void>;

    tokenHeaders(): Record<string, string>;

    handle401Error(
        req: HttpRequest<unknown>,
        next: HttpHandlerFn,
        error: HttpErrorResponse,
    ): Observable<HttpEvent<unknown>>;
}
