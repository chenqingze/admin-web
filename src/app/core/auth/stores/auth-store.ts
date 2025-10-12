import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthUser } from '../models/auth-user';
import { AuthState } from '../models/auth-state';
import { PermissionStore } from './permission-store';
import { AuthApi } from '../api/auth-api';
import { Router } from '@angular/router';
import { LoginRequest } from '../models/login-request';
import { catchError, map, of, tap } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthStore {
    private router = inject(Router);
    private authApi = inject(AuthApi);
    private permissionStore = inject(PermissionStore);

    private readonly LOCAL_STORAGE_ACCESS_TOKEN_KEY: string = 'access_token';

    private _state = signal<AuthState>({
        accessTokenType: 'SESSION', // todo:使用environment读取类型
        accessToken: localStorage.getItem(this.LOCAL_STORAGE_ACCESS_TOKEN_KEY),
        currentUser: null,
    });

    readonly accessTokenType = this._state().accessTokenType;
    readonly accessToken = computed(() => this._state().accessToken ?? null);
    readonly currentUser = computed(() => this._state().currentUser ?? null);

    readonly hasAccessToken = computed(() => !!this.accessToken());
    readonly isLoggedIn = computed(() => !!this.currentUser());

    setAccessToken(accessToken: string | null) {
        this._state.update((state) => ({ ...state, accessToken }));
        if (accessToken) {
            localStorage.setItem(this.LOCAL_STORAGE_ACCESS_TOKEN_KEY, accessToken);
        } else {
            localStorage.removeItem(this.LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        }
    }

    setCurrentUser(user: AuthUser | null) {
        this._state.update((state) => ({ ...state, user }));
        // 同步更新权限
        this.permissionStore.setPermissions(user?.permissions);
    }

    reset() {
        this.setAccessToken(null);
        this.setCurrentUser(null);
    }

    login(req: LoginRequest) {
        return this.authApi.login(req);
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
                const xAuthToken = response.headers.get('X-Auth-Token');
                this.setAccessToken(xAuthToken);
                this.setCurrentUser(response.body);
                return xAuthToken;
            }),
            catchError(() => {
                this.logout();
                return of(null);
            }),
        );
    }

    logout() {
        this.reset();
        // 避免重复 navigate 导致错误
        if (this.router.url !== '/login') {
            this.router.navigate(['/login']);
        }
    }
}
