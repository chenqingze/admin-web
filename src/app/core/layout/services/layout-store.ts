import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class LayoutStore {
    // sidebar是否可以折叠
    private readonly _canCollapse = signal(false);
    readonly canCollapse = this._canCollapse.asReadonly();

    // sidebar折叠状态
    private readonly _isCollapsed = signal(false);
    readonly isCollapsed = this._isCollapsed.asReadonly();

    setCanCollapse(isCollapsed: boolean) {
        this._canCollapse.set(isCollapsed);
    }

    setIsCollapsed(isCollapsed: boolean) {
        this._isCollapsed.set(isCollapsed);
    }
}
