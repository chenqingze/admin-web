import { computed, Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PermissionStore {
    private _permissions = signal<Set<string>>(new Set());
    readonly permissions = this._permissions.asReadonly();

    setPermissions(permissions?: string[] | null) {
        this._permissions.set(new Set(permissions));
    }

    clearPermissions() {
        this._permissions.set(new Set());
    }

    hasPermission(permission: string): boolean {
        return this._permissions().has(permission);
    }

    readonly hasPermissionSignal = (permission: string) => computed(() => this.hasPermission(permission));

    reset() {
        this._permissions.set(new Set());
    }
}
