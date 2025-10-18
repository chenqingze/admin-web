import { inject, Injectable } from '@angular/core';
import { AuthApi } from '../auth-api';
import { AuthStrategy } from './auth-strategy';
import { catchError, EMPTY, Observable, of, tap, throwError } from 'rxjs';
import { AuthInfo } from '../../models/auth-info';
import { LoginRequest } from '../../models/login-request';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { AuthStore } from '../auth-store';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class SessionAuth implements AuthStrategy {
    private readonly router = inject(Router);
    private readonly authApi = inject(AuthApi);
    private readonly authStore = inject(AuthStore);

    init(): Observable<AuthInfo | null> {
        return this.getAuthInfo();
    }

    login(credentials: LoginRequest) {
        return this.authApi.login(credentials).pipe(
            tap((response: HttpResponse<AuthInfo>) => {
                const xAuthToken = response.headers.get('X-Auth-Token');
                const authInfo = response.body as AuthInfo;
                if (xAuthToken) {
                    const { authUser, permissions } = authInfo;
                    this.authStore.setToken(xAuthToken);
                    this.authStore.setCurrentUser(authUser);
                    this.authStore.setPermissions(permissions);
                } else {
                    this.logout();
                }
            }),
            catchError((err) => {
                this.logout();
                return throwError(() => err);
            }),
        );
    }

    getAuthInfo(): Observable<AuthInfo | null> {
        if (this.authStore.token()) {
            return this.authApi.getAuthInfo().pipe(
                tap(({ authUser, permissions }) => {
                    this.authStore.setCurrentUser(authUser);
                    this.authStore.setPermissions(permissions);
                }),
                catchError(() => {
                    this.authStore.reset();
                    return of(null);
                }),
            );
        }
        return of(null);
    }

    logout() {
        this.authStore.reset();
        // 避免重复 navigate 导致错误
        if (this.router.url !== '/auth/login') {
            this.router.navigate(['/auth/login']);
        }
        return EMPTY;
    }

    tokenHeaders(): Record<string, string> {
        const token = this.authStore.token();
        return token ? { 'X-AUTH-TOKEN': token } : {};
    }

    handle401Error(
        req: HttpRequest<unknown>,
        next: HttpHandlerFn,
        error: HttpErrorResponse,
    ): Observable<HttpEvent<unknown>> {
        this.logout();
        return throwError(() => error);
    }
}
