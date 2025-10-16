import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthUser } from '../models/auth-user';
import { AuthState } from '../models/auth-state';
import { AuthApi } from '../api/auth-api';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ACCESS_TOKEN_TYPE } from '../../../app.config';

@Injectable({
    providedIn: 'root',
})
export class AuthStore {
    private readonly LOCAL_STORAGE_ACCESS_TOKEN_KEY: string = 'access_token';
    private readonly SESSION_STORAGE_REDIRECT_URL: string = 'redirect_url';

    private router = inject(Router);
    private authApi = inject(AuthApi);
    private _accessTokenType = inject(ACCESS_TOKEN_TYPE);
    private _state = signal<AuthState>({
        accessTokenType: this._accessTokenType,
        accessToken: localStorage.getItem(this.LOCAL_STORAGE_ACCESS_TOKEN_KEY),
        currentUser: null,
    });

    readonly accessTokenType = this._state().accessTokenType;
    readonly accessToken = computed(() => this._state().accessToken ?? null);
    readonly currentUser = computed(() => this._state().currentUser ?? null);
    readonly permissions = signal<Set<string>>(new Set<string>(this.currentUser()?.permissions ?? []));
    readonly isLoggedIn = computed(() => !!this.currentUser());

    _redirectUrl: string | null = null;

    setAccessToken(accessToken: string | null) {
        this._state.update((state) => ({ ...state, accessToken }));
        if (accessToken) {
            localStorage.setItem(this.LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
        } else {
            localStorage.removeItem(this.LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        }
    }

    setCurrentUser(currentUser: AuthUser | null) {
        this._state.update((state) => ({ ...state, currentUser }));
        this.permissions.set(new Set<string>(this.currentUser()?.permissions ?? []));
    }

    getRedirectUrl() {
        // 优先使用内存中的值，否则尝试 sessionStorage
        return this._redirectUrl || sessionStorage.getItem('redirectUrl');
    }

    setRedirectUrl(url: string | null) {
        this._redirectUrl = url;
        if (url) {
            sessionStorage.setItem(this.SESSION_STORAGE_REDIRECT_URL, url);
        } else {
            sessionStorage.removeItem(this.SESSION_STORAGE_REDIRECT_URL);
        }
    }

    reset() {
        this.setAccessToken(null);
        this.setCurrentUser(null);
        this.setRedirectUrl(null);
    }

    hasPermission(permission: string): boolean {
        return this.permissions().has(permission);
    }

    readonly hasPermissionSignal = (permission: string) => computed(() => this.hasPermission(permission));

    login(req: LoginRequest) {
        return this.authApi.login(req).pipe(
            tap((response: HttpResponse<AuthUser>) => {
                const xAuthToken = response.headers.get('X-Auth-Token');
                this.setAccessToken(xAuthToken);
                this.setCurrentUser(response.body);
            }),
            catchError((err) => {
                this.logout();
                return throwError(() => err);
            }),
        );
    }

    loadCurrentUser() {
        if (this.accessToken()) {
            return this.authApi.getAuthUser().pipe(
                tap((user) => this.setCurrentUser(user)),
                catchError(() => {
                    this.reset();
                    return of(null);
                }),
            );
        }
        return of(null);
    }

    refreshAccessToken() {
        return this.authApi.refreshAccessToken().pipe(
            map((response: HttpResponse<AuthUser>) => {
                const accessToken = response.headers.get('Authorization');
                this.setAccessToken(accessToken);
                this.setCurrentUser(response.body);
                return accessToken;
            }),
            catchError((err) => {
                return throwError(() => err);
            }),
        );
    }

    logout() {
        this.reset();
        // 避免重复 navigate 导致错误
        if (this.router.url !== '/auth/login') {
            this.router.navigate(['/auth/login']);
        }
    }
}
