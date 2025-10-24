import { computed, Injectable, signal } from '@angular/core';
import { AuthUser } from '../models/auth-user';

@Injectable({
    providedIn: 'root',
})
export class AuthStore {
    private readonly LOCAL_STORAGE_TOKEN_KEY: string = '_token';
    private readonly SESSION_STORAGE_REDIRECT_URL: string = 'redirect_url';

    private readonly _token = signal<string | null>(localStorage.getItem(this.LOCAL_STORAGE_TOKEN_KEY));
    readonly token = this._token.asReadonly();

    private readonly _currentUser = signal<AuthUser | null>(null);
    readonly currentUser = this._currentUser.asReadonly();
    readonly isAuthenticated = computed(() => !!this.currentUser());

    private readonly _permissions = signal<Set<string>>(new Set<string>());
    readonly permissions = this._permissions.asReadonly();

    private readonly _expiresAt = signal<number | null>(null);
    readonly expiresAt = this._expiresAt.asReadonly();

    private _redirectUrl: string | null = null;

    setToken(token: string | null) {
        this._token.set(token);
        if (token) {
            localStorage.setItem(this.LOCAL_STORAGE_TOKEN_KEY, token);
        } else {
            localStorage.removeItem(this.LOCAL_STORAGE_TOKEN_KEY);
        }
    }

    setCurrentUser(currentUser: AuthUser | null) {
        this._currentUser.set(currentUser);
    }

    setPermissions(permissions?: string[]) {
        this._permissions.set(new Set(permissions ?? []));
    }

    setExpiresAt(expiresAt: number | null) {
        this._expiresAt.set(expiresAt);
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
        this.setToken(null);
        this.setCurrentUser(null);
        this.setPermissions([]);
        this.setRedirectUrl(null);
        this.setExpiresAt(null);
    }

    hasPermission(permission: string): boolean {
        return this.permissions().has(permission);
    }

    readonly hasPermissionSignal = (permission: string) => computed(() => this.hasPermission(permission));
}
